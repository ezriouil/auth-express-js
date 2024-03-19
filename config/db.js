const mongoose = require('mongoose');

const connectionToDb = async() => {
  try {

    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected Successfully With Mongo DB ^_^ ");

  } catch (error) {

    console.log("Error Connection To DB ==> " + error);

  }
};

module.exports = connectionToDb;