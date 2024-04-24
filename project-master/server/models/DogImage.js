const mongoose = require("mongoose");
const Schema = mongoose.Schema;


let DogImageSchema = new Schema ({
    sender: {type: String},
    url: {type: String}
}, {
    timestamps:true
});

module.exports = mongoose.model("DogImages", DogImageSchema);