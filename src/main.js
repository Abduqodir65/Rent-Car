import express from 'express'
import path from 'path'
import morgan from 'morgan';
import bodyParser from 'body-parser';
import pageRouter from './routes/page.routes.js'
import { appConfig } from './config/app.config.js';
import { mongoDB } from './mongo/mongo.js';
import routes from './routes/index.js';

const app = express();

// Ejs sozlash
app.set('view engine','ejs')
app.set('views',path.join(process.cwd(),'src','views'));
app.use('/public',express.static(path.join(process.cwd(),'public')))

// MIDDLEWARES
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoDB()
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use('/',pageRouter)
app.use("/api/v1", routes)

app.all('*',(req,res) => {
  res.status(404).send({
    message:`Berilgan ${req.url} mavjud emas!!!`
  })
})

app.listen(appConfig.port, appConfig.host, () => {
  console.log(`Server is running on port http://${appConfig.host}:${appConfig.port}`);
});
