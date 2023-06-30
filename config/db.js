const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to mongodb database`.bgMagenta.white)
    } catch (error) {
        console.log(`Mongodb connection error`.bgRed.white)
    }
}

module.exports = connectDB;