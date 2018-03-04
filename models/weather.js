var mongoose = require("mongoose");

var weatherSchema = new mongoose.Schema({
    DATE: String,
    TMAX: Number,
    TMIN: Number
});

module.exports = mongoose.model("weather",weatherSchema);