import * as mongoose from "mongoose";
import app from "./app";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017/employees";
const port = process.env.PORT || 9001;

(async () => {
  // Connect to the database
  const client = await mongoose.connect(url, { useNewUrlParser: true });
  // Populate database with sample data if it's empty
  // Start express App
  app.listen(port);
  console.log(`App listening on port ${port}...`);
})();
