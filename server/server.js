const basicAuth = require("./middleware/basicAuth");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(basicAuth);
app.use(require("./routes"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => console.log("Connected successfully"))
  .on("error", (error) => console.log(`connection error: ${error} `));

app.listen(port, () => console.log(`Server running on port: ${port}`));
