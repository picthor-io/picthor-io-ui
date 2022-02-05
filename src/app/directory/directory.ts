import { AbstractEntity } from '../abstract/abstract-entity';
import { DirectoryStats } from '@picthor/directory/directory-stats';

export class Directory extends AbstractEntity {
  fullPath!: string;
  name!: string;
  label!: string;
  description!: string;
  state!: string;
  type!: string;
  excludes!: string;
  parentId?: number;
  rootDirectoryId?: number;
  lastSyncAt?: Date;
  stats!: DirectoryStats;
  parent!: Directory;
}
