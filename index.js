import express from "express";
import * as dotenv from "dotenv";
import sequelize from "./db.js";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRouter from "./routes/user.routes.js";
import questionRouter from "./routes/question.routes.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/ErrorMiddleware.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(fileUpload())

app.use("/api", userRouter);
app.use("/api", questionRouter);
app.use("/api", likeRouter);
app.use("/api", subscriptionRouter);

app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on ${PORT} port`));
  } catch (error) {
    console.log(error);
  }
};

start();
