import { Document, Model, Types } from "mongoose";

export interface IDepartment extends Document {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type DepartmentModelType = Model<IDepartment>;