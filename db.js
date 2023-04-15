require("dotenv").config();


const mongoose = require("mongoose");
const mongoURI = `mongodb://${process.env.BASE_URL}/notebook`;
const connectToMongo = () => {
  mongoose.connect(mongoURI, { useNewUrlParser: true });
  console.log("connected successfully");
};

module.exports = connectToMongo;
