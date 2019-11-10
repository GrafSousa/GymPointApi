import mongoose from 'mongoose';

interface CheckinInterface extends mongoose.Document {
  student: number;
}

const CheckinSchema = new mongoose.Schema(
  {
    student: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export { CheckinInterface };
export default mongoose.model<CheckinInterface>('Checkin', CheckinSchema);
