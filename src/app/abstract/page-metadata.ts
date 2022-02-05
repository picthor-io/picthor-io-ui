export class PageMetadata {
  // eslint-disable-next-line id-blacklist
  number = 1;
  size = 20;
  totalPages!: number;
  totalElements!: number;
  hasPrevious!: boolean;
  hasNext!: boolean;
  isFirst!: boolean;
  isLast!: boolean;

  sorts?: Array<Sort>;
  filters?: Array<Filter>;
}

export class Filter {
  name?: string;
  allowedValues!: Array<{
    name: string;
    value: string;
  }>;
  applied?: boolean;
  appliedValue: any;
}

export class Sort {
  name?: string;
  direction?: string;
  applied?: boolean;
}
