import {Component, OnInit} from '@angular/core';
import {UserToken} from '../../model/user-token';
import {User} from '../../model/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {HouseService} from '../../service/house/house.service';
import {BillService} from '../../service/bill/bill.service';
import {NotificationService} from '../../service/notification/notification.service';
import {NotificationUser} from '../../model/notificationUser';

@Component({
  selector: 'app-layout-host',
  templateUrl: './layout-host.component.html',
  styleUrls: ['./layout-host.component.scss']
})
export class LayoutHostComponent implements OnInit {

  currentUser: UserToken;
  user: User = {id: 0};
  hasRoleAdmin = false;
  listNotification: NotificationUser[] = [];

  constructor(private router: Router,
              private houseService: HouseService,
              private billService: BillService,
              private notificationService: NotificationService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }

  ngOnInit(): void {
    if (this.currentUser != null) {
      this.user.id = this.currentUser.id;
      setInterval(() => {
        this.getAllNotificationByUser();
      }, 2000);
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getAllNotificationByUser() {
    this.notificationService.getAllNotificationByUser(this.user).subscribe(listNotification => {
      this.listNotification = [];
      listNotification.map((item) => {
        if (item.content !== 'Thuê nhà thành công') {
          this.listNotification.push(item);
        }
      });
    });
  }

  updateStatus(notification: any) {
    // tslint:disable-next-line:prefer-const
    let user: any;
    user = {
      id: notification
    };
    this.notificationService.updateNotification(user).subscribe();
    window.location.reload();
  }
}
