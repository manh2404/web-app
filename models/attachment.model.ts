import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAttachment extends Document {
    projectId: mongoose.Types.ObjectId;
    workItemId: mongoose.Types.ObjectId;

    fileName: string;
    size: number;
    type: string;
    path: string;

    updateBy?: mongoose.Types.ObjectId;
    isDeleted: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
        workItemId: { type: Schema.Types.ObjectId, ref: "WorkItem", required: true, index: true },

        fileName: { type: String, required: true },
        size: { type: Number },
        type: { type: String },
        path: { type: String, required: true },

        updateBy: { type: Schema.Types.ObjectId, ref: "User" },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Attachment: Model<IAttachment> =
    mongoose.models.Attachment || mongoose.model<IAttachment>("Attachment", attachmentSchema);

export default Attachment;