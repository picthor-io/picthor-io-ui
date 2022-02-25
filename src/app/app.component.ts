import { Component, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationsService } from '@picthor/notifications/notifications.service';
import { fromEvent, interval, NEVER, Subscription } from 'rxjs';
import { distinctUntilChanged, map, mergeAll, mergeMap, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnDestroy {
  title = 'picthor-io';

  private visibilityChange$ = fromEvent(document, 'visibilitychange').pipe(
    map((x) => document.visibilityState),
    startWith('visible'),
    shareReplay(1)
  );

  private isVisible$ = this.visibilityChange$.pipe(
    map((x) => x === 'visible'),
    distinctUntilChanged()
  );

  notifications$?: Subscription;

  constructor(private toastr: ToastrService, private notifications: NotificationsService) {
    this.notifications$ = this.isVisible$
      .pipe(
        switchMap((visible) => (visible ? interval(2000) : NEVER)),
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
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.notifications$?.unsubscribe();
  }
}
