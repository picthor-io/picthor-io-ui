import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '@picthor/notifications/notification';
import { AbstractEntityService } from '@picthor/abstract/abstract-entity.service';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationsService extends AbstractEntityService<Notification> {
  constructor(http: HttpClient) {
    super('/api/notifications', http);
  }

  getAll(): Observable<Notification[]> {
    return this.get('/');
  }
}
