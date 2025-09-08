import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import main from "./libs/db.js";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route.js';
import emailVerification from './routes/emailVerification.route.js';
import { redisConnection } from "./libs/redisConnection.js";
import profileRoutes from './routes/profile.route.js'; 
import {errorHandler} from './middlewares/errorHandler.middleware.js';
import jobRoutes from './routes/jobs.route.js';



const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(express.static("uploads"))

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

//db connection
main()
  .then((res) => console.log("Db connected"))
  .catch((err) => console.log("Error in Db connection"));

//redis connection
redisConnection()
  

  app.use('/api/v1/user' , userRoutes);
  app.use('/api/v1/email' , emailVerification);
  app.use('/api/v1/profile', profileRoutes); 
  app.use('/api/v1/jobs' , jobRoutes)
  


//Error handling resposne
app.use(errorHandler);


app.listen(PORT, () => console.log("server is running"));