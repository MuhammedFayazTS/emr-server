import mongoose, { Schema, model } from "mongoose";
import mongooseDelete from "mongoose-delete";
import { IDepartment, DepartmentModelType } from "./department.types";

export const baseOptions = {
    collection: 'departments',
    timestamps: true,
};

const departmentSchema = new Schema<IDepartment, DepartmentModelType>(
    {
        name: {
            type: String,
            required: [true, 'Department name is required'],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    baseOptions
);

// soft delete plugin
departmentSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: true,
});

// ---- Indexes ----
departmentSchema.index({ name: 1 }, { unique: true, partialFilterExpression: { deleted: false } });
departmentSchema.index({ isActive: 1 });

// ---- toJSON configuration ----
departmentSchema.set("toJSON", {
    transform(_doc, ret) {
        const { __v, ...safeObject } = ret;
        return safeObject;
    },
});

export const Department =
    (mongoose.models.Department as DepartmentModelType) ||
    model<IDepartment, DepartmentModelType>('Department', departmentSchema);