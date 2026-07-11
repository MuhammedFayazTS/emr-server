import { Document, Model, Types } from "mongoose";
import { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";
export interface IDepartment {
    _id: Types.ObjectId;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type DepartmentDocument = IDepartment & Document & SoftDeleteDocument;
export type DepartmentModelType = SoftDeleteModel<DepartmentDocument>;