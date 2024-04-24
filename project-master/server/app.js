var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var cors = require("cors");
const User = require("./models/User");
const Image = require("./models/Image");
const DogImage = require("./models/DogImage");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();

// Multer setup for image upload
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/src/images');
    },
    filename: (req, file, cb) => {
        const unique = Date.now();
        cb(null, unique + "_" + file.originalname);
    }
})
const upload = multer({ storage: storage })


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({origin: "http://localhost:3000", optionsSuccessStatus: 200}));


// CONNECTING TO MONGODB
const url = "mongodb://localhost:27017/project";
mongoose.connect(url);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind("Connection failed"));


app.get('/user', async (req, res) => {
    const dbUser = await User.findOne({email: req.query.userEmail});
    res.send(dbUser);
})

app.post('/createaccount', async (req, res) => {
    const { email, name, password } = req.body;
    const tempAccount = await User.findOne({email: email});
    // FAILED IF EMAIL IS ALREADY IN USE
    if(!tempAccount) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email: email,
                name: name,
                password: hashedPassword
            });
            await newUser.save();
            const tempAccount = await User.findOne({email: email});
            let token = jwt.sign(
                {email: email},
                process.env.SECRET,
                {expiresIn: 300,}
            );
            res.status(201).json({token, userID: tempAccount._id.toString(), userEmail: email})
        } catch {
            res.send("Failed");
        }
    } else {
        res.status(403).send({email: "Email already in use."})
    }
})

// LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const tempAccount = await User.findOne({email: email});
    // FAILED LOGIN IF USER DOES NOT EXIST
    if(!tempAccount) { 
        res.status(403).send("Login failed");
    } else {
        bcrypt.compare(password, tempAccount.password, (error, matched) => {
            if(error) throw error;
            if(matched) {
                let token = jwt.sign(
                    {email: email},
                    process.env.SECRET,
                    {expiresIn: 300,}
                )
                res.status(201).json({token, userID: tempAccount._id.toString(), userEmail: email});
            }
        })
    }
})

// This is used to upload images to database
app.post('/upload', upload.single('image'), (req, res) => {
    const filename = req.file.filename;
    try {
        const newImage = new Image({
            sender: req.body.user,
            image: filename
        })
        newImage.save();
    } catch {
        res.send("Failed");
    }
    res.send("Image uploaded");
})

// Find all user's imagenames from database
app.get('/images', async (req, res) => {
    const images = await Image.find({sender: req.query.UserEmail});
    res.send(images);
})

app.post('/saveDogImage', async (req, res) => {
    try { 

        const { url, sender } = req.body;

        const newImage = new DogImage({
            sender: sender,
            url: url
        });
        await newImage.save();
        res.status(201).send('Dog image saved successfully');

    } catch (error) {
        console.error('Error fetching or saving dog image:', error);
        res.status(500).send('Server error');
    }
});

//MIIKA: GET ALL IMAGES FROM DATABASE
app.get('/dogimages', async (req, res) => {
    try {
        const images = await DogImage.find({sender: req.query.UserEmail}).sort({createdAt: -1 });
        res.status(200).json(images);
    } catch (error) {
        console.error('Error getting images:', error);
        res.status(500).send('Server error');
    }
});

module.exports = app;