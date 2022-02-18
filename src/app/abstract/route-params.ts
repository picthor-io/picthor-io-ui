import { ParamMap } from '@angular/router';
import { FilterParams, SortParams } from '@picthor/file-data/file-data-grid-sort/filter-and-sort.service';

export class RouteParams {
  sort?: SortParams[];
  filter?: FilterParams[];
  pageNum?: number;
  pageSize?: number;

  public constructor(init?: Partial<RouteParams>) {
    Object.assign(this, init);
  }

  static fromParamMap(paramMap: ParamMap) {
    const routeParams = new RouteParams();
    if (paramMap) {
      if (paramMap.has('pageNum')) {
        const pageNum = paramMap.get('pageNum');
        if (pageNum) {
          routeParams.pageNum = +pageNum;
        }
      }
      if (paramMap.has('pageSize')) {
        const pageSize = paramMap.get('pageSize');
        if (pageSize) {
          routeParams.pageSize = +pageSize;
        }
      }
      if (paramMap.has('sort')) {
        const sort = paramMap.get('sort');
        if (sort) {
          routeParams.sort = JSON.parse(sort);
        }
      }
      if (paramMap.has('filter')) {
        const filter = paramMap.get('filter');
        if (filter) {
          routeParams.filter = JSON.parse(filter);
        }
      }
      routeParams.cleanup();
    }
    return routeParams;
  }

  public cleanup() {
    if (this.sort && this.sort.length > 0) {
      this.sort = this.sort.filter((s) => {
        return s.dir && (s.dir.toLowerCase() === 'asc' || s.dir.toLowerCase() === 'desc');
      });
    }
    if (this.filter && this.filter.length > 0) {
      this.filter = this.filter.filter((s) => {
        return s.value != null && s.value.length > 0;
      });
    }
  }

  applyDefaults(defaults: RouteParams) {
    if (!this.pageNum) {
      this.pageNum = defaults.pageNum;
    }
    if (!this.pageSize) {
      this.pageSize = defaults.pageSize;
    }
    if (defaults.sort) {
      if (this.sort) {
        defaults.sort.forEach((ds) => {
          if (this.sort && !this.sort.find((s) => s.field === ds.field)) {
            this.sort.push(ds);
          }
        });
      } else {
        this.sort = defaults.sort;
      }
    }
    if (defaults.filter) {
      if (this.filter) {
        defaults.filter.forEach((ds) => {
          if (this.filter && !this.filter.find((s) => s.field === ds.field)) {
            this.filter.push(ds);
          }
        });
      } else {
        this.filter = defaults.filter;
      }
    }
    this.cleanup();
  }

  public toServiceQuery(): string {
    const params: Array<string> = [];
    if (this.pageNum) {
      params.push('pageNum=' + this.pageNum);
    }
    if (this.pageSize) {
      params.push('pageSize=' + this.pageSize);
    }
    if (this.sort && this.sort.length > 0) {
      params.push('sort=' + this.sort.map((s) => s.field + ':' + s.dir).join(';'));
    }
    if (this.filter && this.filter.length > 0) {
      params.push('filter=' + this.filter.map((s) => s.field + ':' + s.value).join(';'));
    }
    if (params.length > 0) {
      return '?' + params.join('&');
    }
    return '';
  }

  public toBrowserQuery(): string {
    const params: Array<string> = [];
    if (this.pageNum) {
      params.push('pageNum=' + this.pageNum);
    }
    if (this.pageSize) {
      params.push('pageSize=' + this.pageSize);
    }
    if (this.sort && this.sort.length > 0) {
      params.push('sort=' + JSON.stringify(this.sort));
    }
    if (this.filter && this.filter.length > 0) {
      params.push('filter=' + JSON.stringify(this.filter));
    }
    if (params.length > 0) {
      return ';' + params.join(';');
    }
    return '';
  }
}
