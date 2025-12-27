import mongoose, { Schema, Document, Model } from 'mongoose';

// 1. Định nghĩa kiểu dữ liệu (Interface) để TS hiểu
export interface IAttachment extends Document {
  fileName: string;
  size: number;
  type: string;
  path: string;
  updateBy?: mongoose.Types.ObjectId; // Dấu ? nghĩa là có thể null
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Định nghĩa Schema cho Mongoose
const attachmentSchema = new Schema<IAttachment>(
  {
    fileName: { type: String, required: true },
    size: { type: Number },
    type: { type: String },
    path: { type: String, required: true },
    updateBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true, // Tự động tạo createdAt, updatedAt
  }
);

// 3. Export Model (Có kiểm tra để tránh lỗi khi hot-reload trong Next.js)
const Attachment: Model<IAttachment> = mongoose.models.Attachment || mongoose.model<IAttachment>('Attachment', attachmentSchema);

export default Attachment;