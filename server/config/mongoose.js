import mongoose from "mongoose";
let MongoURL = "/*databaseName*/"; //<-- To manually config database URL change this.

export default async function () {
  try {
    await mongoose.connect(MongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("MongoDB Connected.");
  } catch (error) {
    console.log("MongoDB Disconnnected.");
  }
}
