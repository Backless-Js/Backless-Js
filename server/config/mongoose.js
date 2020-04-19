import mongoose from "mongoose";
let MongoURL = "mongodb://localhost:27017/cobaDatabase"; //<-- To manually config database URL change this.

export default async function () {
  try {
    if (process.env.NODE_ENV === "test") MongoURL += "_test";
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
