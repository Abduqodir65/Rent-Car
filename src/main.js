import path from "path";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import pageRouter from "./routes/page.routes.js";
import appConfig from "./config/app.config.js";
import mongoDB from "./mongo/mongo.js";

const app = express();


app.use(morgan("tiny"));

app.set("view engine", "ejs");

app.set("views", path.join(process.cwd(), "src", "views"));

app.use("/public", express.static(path.join(process.cwd(), "src","public"))); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoDB()
  .then(() => {
    console.log("MongoDB ga ulandi");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/", pageRouter);
app.use("/api/v1", routes);

app.all("*", (req, res) => {
  res.status(404).send({
    message: `Berilgan ${req.url} endpoint mavjud emas`,
  });
});

app.listen(appConfig.port, appConfig.host, () => {
  console.log(`listening on port http://${appConfig.host}:${appConfig.port}`);
});