import path from "path";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRoutes from "./routes/cards";
import { createUser, login } from "./controllers/users";
import { logError, logRequest } from "./middlewares/logHistory";
import { celebrate, errors } from "celebrate";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./errors/notFoundError";
import auth from "./middlewares/auth";
import { userValidationSchema } from "./middlewares/validation";

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb");

// Логирование запросов
app.use(logRequest);

// Маршруты, не требующие авторизации
app.post("/signin", celebrate(userValidationSchema), login);
app.post("/signup", celebrate(userValidationSchema), createUser);

app.use(auth);

app.use("/users", usersRouter);
app.use("/cards", cardsRoutes);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError("Ресурс не найден"));
});

// Логирование ошибок
app.use(logError);

// Обработчик ошибок celebrate
app.use(errors());

// Централизованный обработчик ошибок
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log("Ссылка на сервер");
  console.log(BASE_PATH);
});
