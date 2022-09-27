import { AbstractEntity } from '@picthor/abstract/abstract-entity';
import { JobCounter } from '@picthor/batch-job/job-counter';

export class BatchJob extends AbstractEntity {
  name!: string;
  state!: string;
  type!: string;
  processType!: string;
  processAt!: Date;
  totalItems!: number;
  totalProcessed!: number;
  rootDirectoryId!: number;
  counter?: JobCounter;
}
