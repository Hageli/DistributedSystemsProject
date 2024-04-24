const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let imageSchema = new Schema ({
    sender: {type: String},
    image: {type: String}
});

module.exports = mongoose.model("images", imageSchema);