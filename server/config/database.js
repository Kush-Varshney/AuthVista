import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/notesapp"

    if (!mongoURI) {
      throw new Error("MongoDB URI is not defined in environment variables")
    }

    console.log("Attempting to connect to MongoDB...")
    console.log("MongoDB URI:", mongoURI.replace(/\/\/.*@/, "//***:***@")) // Hide credentials in logs

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Database Name: ${conn.connection.name}`)
  } catch (error) {
    console.error("Database connection error:", error.message)
    console.error("Make sure MongoDB is running and the connection string is correct")
    process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected")
})

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err)
})

export default connectDB
