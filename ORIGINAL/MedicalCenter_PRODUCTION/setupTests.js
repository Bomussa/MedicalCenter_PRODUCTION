
const mongoose = require("mongoose");
require("dotenv").config({ path: "/home/ubuntu/AttarMedical_Backend/.env" });

process.env.NODE_ENV = "test";
process.env.MONGO_URI = "mongodb://localhost:27017/AttarMedicalTest";

beforeAll(async () => {
// removed: // removed:   console.log("Connecting to MongoDB for tests...");
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 600000 });
// removed: // removed:     console.log("MongoDB connected for tests.");
  } catch (error) {
    console.error("MongoDB connection error in beforeAll:", error);
    process.exit(1);
  }
});

beforeEach(async () => {
// removed: // removed:   console.log("Clearing database collections...");
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
// removed: // removed:   console.log("Database collections cleared.");
});

afterAll(async () => {
// removed: // removed:   console.log("Disconnecting from MongoDB...");
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) { // Check if connected or connecting
    try {
      await mongoose.connection.dropDatabase();
// removed: // removed:       console.log("Test database dropped.");
      await mongoose.connection.close();
// removed: // removed:       console.log("MongoDB connection closed.");
    } catch (error) {
      console.error("Error during afterAll cleanup:", error);
    }
  } else {
// removed: // removed:     console.log("MongoDB connection already closed or not established.");
  }
});

