import "dotenv/config";
import express from "express";
import cors from "cors";
import MongoConnect from "./config/mongoose";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
const app = express();
const PORT = process.env.PORT;

// CONNECT MONGO
MongoConnect();

// BODY PARSER
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVER ROUTES
app.use(routes);
app.use(errorHandler);

// SERVE SERVER
app.listen(PORT, () =>
  console.log(`🚀  Server ready at http://localhost:${PORT}`)
);

module.exports = app;