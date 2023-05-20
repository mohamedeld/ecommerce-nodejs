const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
// const globalError = require("./middleware/errorMW");
const databaseConnection = require("./config/database");
const categoryRouter = require("./routes/categoryRoutes");
const subCategoryRouter = require("./routes/subCategoryRouter");
const brandRouter = require("./routes/brandRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
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
app.use("/category", categoryRouter);
app.use("/subCategory", subCategoryRouter);
app.use("/brand", brandRouter);
app.use("/products", productRouter);

app.use((request, response, next) => {
  response.status(404).json({
    message: "Page Not Found",
  });
});

app.use((error, request, response, next) => {
  response.status(500).json({
    message: error + "",
  });
});

// error outside express
process.on("unhandledRejection", (error) => {
  console.log(`UnhandledRejection ${error}`);
  server.close(() => {
    console.error("Shut down...");
    process.exit(1);
  });
});
