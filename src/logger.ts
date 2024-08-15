import { createLogger, format, transports } from "winston";
import path from "path";

export const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

export const requestLogger = createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/request.log"),
    }),
  ],
});

export const errorLogger = createLogger({
  level: "error",
  format: logFormat,
  transports: [
    new transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
    }),
  ],
});
