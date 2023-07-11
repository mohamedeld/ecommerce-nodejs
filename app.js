const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const mountRoutes = require("./routes");

const globalErrorHandler = require("./controller/errorController");
const databaseConnection = require("./config/database");

const app = express();
process.on("uncaughtException", (err) => {
  console.log("unhandler exception shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

app.use(express.json());
dotenv.config({ path: "./config.env" });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
mountRoutes(app);
databaseConnection();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("listening");
});


app.use((request, response, next) => {
  response.status(404).json({
    message: "Page Not Found",
  });
});

app.use(globalErrorHandler);

// error outside express
process.on("unhandledRejection", (error) => {
  console.log(`UnhandledRejection ${error}`);
  server.close(() => {
    console.error("Shut down...");
    process.exit(1);
  });
});

