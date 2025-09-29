import mongoose from "mongoose"

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please add content"],
      maxlength: [5001, "Content cannot be more than 5001 characters"],
    },
    category: {
      type: String,
      enum: ["personal", "work", "study", "ideas", "other"],
      default: "other",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create index for text search
noteSchema.index({
  title: "text",
  content: "text",
  tags: "text",
})

// Create compound index for user queries
noteSchema.index({ user: 1, createdAt: -1 })
noteSchema.index({ user: 1, category: 1 })
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 })

export default mongoose.model("Note", noteSchema)
