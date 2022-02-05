export abstract class AbstractEntity {
  id!: number;
  createdAt!: Date;
  updatedAt?: Date;
  createdById?: number;
  createdBy?: any;
  updatedBy?: any;
  updatedById?: number;
}
