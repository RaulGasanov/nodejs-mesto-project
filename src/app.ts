import path from "path";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRoutes from "./routes/cards";

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

// Подключение роутов
app.use("/users", usersRouter);
app.use("/cards", cardsRoutes);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ message: "Запрашиваемый ресурс не найден" });
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
