// models/activity.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type ActivityType =
    | "create"
    | "comment"
    | "state"
    | "assign"
    | "attachment"
    | "update";

export interface IActivity extends Document {
    projectId: mongoose.Types.ObjectId;
    workItemId: mongoose.Types.ObjectId;

    type: ActivityType;

    actor: {
        id: mongoose.Types.ObjectId;
        name: string;
        email?: string;
    };

    // text/html bạn đang dùng RichText -> cho phép string
    content: string;

    // optional: lưu thêm chi tiết thay đổi (from/to status, assignee...)
    meta?: Record<string, any>;

    createdAt: Date;
    updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
        workItemId: { type: Schema.Types.ObjectId, ref: "WorkItem", required: true, index: true },

        type: { type: String, required: true, index: true },

        actor: {
            id: { type: Schema.Types.ObjectId, ref: "User", required: true },
            name: { type: String, required: true },
            email: { type: String },
        },

        content: { type: String, default: "" },
        meta: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

// query timeline nhanh
ActivitySchema.index({ workItemId: 1, createdAt: -1 });

const Activity: Model<IActivity> =
    mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;
