const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");

const globalErrorHandler = require("./controller/errorController");
const databaseConnection = require("./config/database");
const categoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRouter");
const brandRouter = require("./routes/brandRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const reviewRouter = require("./routes/reviewRoutes");

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

databaseConnection();
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log("listening");
});
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/products", productRouter);
app.use("/review",reviewRouter);

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

