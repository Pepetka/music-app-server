import path from "path";
import {
  createLogger,
  format,
  transports,
  Logger as WinstonLogger,
} from "winston";
import "winston-daily-rotate-file";

class Logger {
  logger: WinstonLogger;
  logsDir: string;

  constructor() {
    this.logsDir = path.join(__dirname, "..", "logs");
    this.logger = this.createLogger();

    this.initDevLog();
  }

  createLogger() {
    return createLogger({
      format: format.combine(
        format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        format.errors({ stack: true }),
        format.align(),
        format.printf(
          (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
        ),
      ),
      defaultMeta: { service: "user-service" },
      transports: [
        this.createDailyTransport("info"),
        this.createDailyTransport("error"),
      ],
      exitOnError: false,
    });
  }

  createDailyTransport(level: string) {
    return new transports.DailyRotateFile({
      level,
      filename: `%DATE%-${level}.log`,
      dirname: this.logsDir,
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      json: false,
    });
  }

  initDevLog() {
    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new transports.Console({
          level: "debug",
          format: format.combine(format.cli(), format.colorize({ all: true })),
        }),
      );
    }
  }
}

export default new Logger().logger;
