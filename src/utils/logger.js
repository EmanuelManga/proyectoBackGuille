import winston from "winston";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.ENTORNO === "true" ? "info" : "debug",
            format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.simple()),
        }),
        // Agregar el transporte de archivo solo si es producción
        process.env.ENTORNO === "true"
            ? new winston.transports.File({
                  filename: "./errors.log",
                  level: "error",
                  format: winston.format.simple(),
              })
            : null,
    ].filter((transport) => transport !== null),
});

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
};

/* req.logger.info(
    `${req.method} on ${req.url} - ${new Date().toLocaleTimeString()}`
  ); */
