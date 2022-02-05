import { PageMetadata } from './page-metadata';

export class PagedEntities<T> {
  content!: Array<T>;
  pageMetadata!: PageMetadata;
}
