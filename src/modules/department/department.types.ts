import { Model } from "mongoose";

import type { Document, Types } from "mongoose";
import type { SoftDeleteDocument, SoftDeleteModel } from "mongoose-delete";
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
