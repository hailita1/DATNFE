import {Component, OnInit} from '@angular/core';
import {UserToken} from '../../model/user-token';
import {User} from '../../model/user';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {Bill} from '../../model/bill';
import {HouseService} from '../../service/house/house.service';
import {House} from '../../model/house';
import {BillService} from '../../service/bill/bill.service';
import {defaultLongDateFormat} from 'ngx-bootstrap/chronos/locale/locale.class';

@Component({
  selector: 'app-layout-host',
  templateUrl: './layout-host.component.html',
  styleUrls: ['./layout-host.component.scss']
})
export class LayoutHostComponent implements OnInit {

  currentUser: UserToken;
  user: User;
  hasRoleAdmin = false;

  constructor(private router: Router,
              private houseService: HouseService,
              private billService: BillService,
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
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
