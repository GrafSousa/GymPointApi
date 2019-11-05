import mongoose from 'mongoose';

interface HelpOrderInterface extends mongoose.Document {
  student: number;
  question: string;
  answer?: string;
  answer_at?: Date;
}

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

export default mongoose.model<HelpOrderInterface>('HelpOrder', HelpOrderSchema);
