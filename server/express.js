import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import user_router from "./routes/UserRoutes";
import auth_router from "./routes/AuthRoutes";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("*", cors());

app.use("/", user_router);
app.use("/", auth_router);
/* app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
}); */
// Let the things inside frontend folder loadable from browser under public path
app.use("/public", express.static(path.join(__dirname, "frontend")));

// No matter what browser ask, return the content
app.get("*", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "./index.html"));
});

export default app;
