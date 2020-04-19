import mongoose from "mongoose";
// let MongoURL = "/*databaseName*/"; //<-- To manually config database URL change this.
let MongoURL = "mongodb://localhost:27017/tulangbelakang";

export default async function () {
  if (process.env.NODE_ENV === "test") MongoURL += "_test";
  try {
    await mongoose.connect(MongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("MongoDB Connected.");
  } catch (error) {
    console.log("MongoDB Disconnnected.");
    console.log("MongoDB Error:", error);
  }
}

export { MongoURL };