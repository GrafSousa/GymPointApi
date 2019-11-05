import mongoose from 'mongoose';

const HelpOrderSchema = new mongoose.Schema(
  {
    student: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: false,
    },
    answer_at: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('HelpOrder', HelpOrderSchema);
