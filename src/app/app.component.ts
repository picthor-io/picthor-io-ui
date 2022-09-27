import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { bufferToggle, filter, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { Notification } from '@picthor/notifications/notification';
import { RxStompService } from '@picthor/rx-stomp.service';
import { Message } from '@stomp/stompjs';


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'picthor-io';

  private visibilitychange$ = fromEvent(document, 'visibilitychange').pipe(
    map((x) => document.visibilityState),
    startWith('visible'),
    shareReplay(1),
    map((x) => x === 'visible'),
    tap(visible => this.visible = visible),
  );

  private isVisible$ = this.visibilitychange$.pipe(
    filter(visible => visible)
  )
  private isNotVisible$ = this.visibilitychange$.pipe(
    filter(visible => !visible)
  )

  private visible = true;

  constructor(private toastr: ToastrService, private rxStompService: RxStompService) {

    this.rxStompService.watch('/topic/notifications').pipe(
      map<Message, Notification>(message => Object.assign(new Notification(), JSON.parse(message.body))),
      tap(notification => {
        if (this.visible) {
          this.showNotification(notification)
        }
      }),
      bufferToggle(this.isNotVisible$, () => this.isVisible$),
      tap(notifications => {
        if (this.visible) {
          notifications.forEach((notification) => this.showNotification(notification));
        }
      }),
    ).subscribe();
  }

  private showNotification(notification: Notification) {
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
  }

}
