import app from "./express";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const mongoClientURI =
  process.env.MONGODB_URI ||
  process.env.MONGO_HOST ||
  "mongodb://" + (process.env.IP || "localhost") + ":" + (process.env.MONGO_PORT || "27017") + "/mernloginsystem";

/* CONNECT TO MONGODB */
const db = mongoose.connect;
db(mongoClientURI);
mongoose.connection
  .on("error", () => {
    throw new Error(`Unable to connect to ${mongoClientURI}`);
  })
  .once("open", () => {
    console.log("Connected to %s", mongoClientURI);
  });
/* <-- end --> */

/* CONNECT To NodeJs SERVER USING EXPRESS */
app.listen(3000, err => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running on port ${PORT}`);
});
/* <--end--> */
