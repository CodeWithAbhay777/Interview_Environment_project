import express from "express";
const app = express();
import "dotenv/config";
import cors from "cors";
import main from "./db.js";
import cookieParser from "cookie-parser";
import userRoutes from './routes/user.route.js';



const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());

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

  app.use('/api/v1/user' , userRoutes);

app.listen(PORT, () => console.log("server is running"));