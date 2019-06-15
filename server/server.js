import dotenv from "dotenv";
dotenv.config();

import app from "./express";
import mongoose from "mongoose";
import config from "../config";

/* CONNECT TO MONGODB */
const db = mongoose.connect;
db(config.mongoClientURI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
mongoose.connection
  .on("error", () => {
    throw new Error(`Unable to connect to ${config.mongoClientURI}`);
  })
  .once("open", () => {
    console.log("Connected to %s", config.mongoClientURI);
  });
/* <-- end --> */

/* CONNECT To NodeJs SERVER USING EXPRESS */
app.listen(3000, err => {
  if (err) {
    console.log(err);
  }
  const mail = process.env.MAIL_USER;
  console.log(`Server running on port ${config.PORT}`);
  /*   console.log(process.env.MAIL_USER);
  console.log(config.mailUser); */
});
/* <--end--> */
