import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from '@picthor/notifications/notifications.service';
import { Subscription, timer } from 'rxjs';
import { mergeAll, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnDestroy {
  title = 'picthor-io';

  notificationsObservable = timer(0, 5000).pipe(
    mergeMap(() => this.notifications.getAll()),
    mergeAll(),
    tap((notification) => {
      switch (notification.type) {
        case 'INFO':
          this.toastr.info(notification.message, notification.title);
          break;
        case 'SUCCESS':
          this.toastr.success(notification.message, notification.title);
          break;
        case 'ERROR':
          this.toastr.error(notification.message, notification.title);
          break;
      }
    })
  );
  notifications$?: Subscription;

  constructor(private toastr: ToastrService, private notifications: NotificationsService) {
    this.notifications$ = this.notificationsObservable.subscribe();
  }

  ngOnDestroy(): void {
    this.notifications$?.unsubscribe();
  }
}
