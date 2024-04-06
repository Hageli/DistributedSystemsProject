var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();

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
    const { email, name, age, description, password } = req.body;
    const lowerEmail = email.toLowerCase();
    const tempAccount = await User.findOne({email: lowerEmail});
    // FAILED IF EMAIL IS ALREADY IN USE
    if(!tempAccount) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                email: lowerEmail,
                name: name,
                age: age,
                description: description,
                password: hashedPassword
            });
            await newUser.save();
            const tempAccount = await User.findOne({email: email});
            let token = jwt.sign(
                {email: email},
                process.env.SECRET,
                {expiresIn: 300,}
            );
            res.status(201).json({token, userID: tempAccount._id.toString(), userEmail: lowerEmail})
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

module.exports = app;
