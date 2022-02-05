import { AbstractEntity } from '@picthor/abstract/abstract-entity';

export class Notification extends AbstractEntity{
  title!: string;
  message!: string;
  type!: string;
}
