import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export class AbstractApiService {
  protected http: HttpClient;

  protected basePath?: string;
  protected apiUrl: string;

  constructor(http: HttpClient) {
    this.http = http;
    this.apiUrl = environment.apiHost;
  }
}
