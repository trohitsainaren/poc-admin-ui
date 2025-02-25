import winston from "winston";

// Create a logger instance with custom configuration
const logger = winston.createLogger({
    level: "info", // Set the default log level (e.g., 'info', 'debug', 'error')
    format: winston.format.combine(
        winston.format.timestamp(), // Add a timestamp to each log
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        // Log to a file
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
        // Optionally log to the console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Add colors for console logs
                winston.format.simple()
            )
        }),
    ],
});

// If we're not in production, log to the console (for debugging)
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    );
}

export default logger;
