import mongoose, { Schema } from "mongoose";

const AuditSchema = new Schema(
    {
        // actor
        userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
        email: { type: String, index: true },
        role: { type: String, index: true },

        // action
        action: { type: String, required: true, index: true },
        resource: { type: String, index: true },
        resourceId: { type: Schema.Types.ObjectId, index: true },

        // evidence
        before: { type: Schema.Types.Mixed },
        after: { type: Schema.Types.Mixed },

        // request context
        method: String,
        path: String,
        ip: String,
        userAgent: String,

        // outcome
        success: { type: Boolean, default: true, index: true },
        errorMessage: String,

        // optional correlation
        requestId: { type: String, index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

AuditSchema.index({ createdAt: -1 });
AuditSchema.index({ userId: 1, createdAt: -1 });
AuditSchema.index({ action: 1, createdAt: -1 });
AuditSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });

export default mongoose.models.Audit || mongoose.model("Audit", AuditSchema);
