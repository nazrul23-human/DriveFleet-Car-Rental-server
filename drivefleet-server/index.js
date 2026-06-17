const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Load .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Check .env values
console.log("USER:", process.env.DB_USER);
console.log("PASS:", process.env.DB_PASS);

// MongoDB URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eychk9p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create Mongo Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// MongoDB Connection

async function run() {
  try {
    await client.connect();

    const carsCollection = client
      .db("driveFleetDB")
      .collection("cars");

    app.get("/cars", async (req, res) => {
      const result = await carsCollection.find().toArray();
      res.send(result);
    });

    app.post("/cars", async (req, res) => {
      const car = req.body;
      const result = await carsCollection.insertOne(car);
      res.send(result);
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log(error);
  }
}

run();

// Test Route
app.get("/", (req, res) => {
  res.send("DriveFleet Server Running");
});

// Server Start
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});