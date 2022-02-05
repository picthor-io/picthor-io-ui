import { AbstractEntity } from '@picthor/abstract/abstract-entity';

export class BatchJob extends AbstractEntity {
  name!: string;
  state!: string;
  type!: string;
  processType!: string;
  processAt!: Date;
  totalItems!: number;
  totalProcessed!: number;
  counterCurrent!: number;
  counterTotal!: number;
}
