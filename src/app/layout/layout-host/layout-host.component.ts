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
  listBill: Bill[] = [];
  listHouseOfHost: House[];
  dem = 0;

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
    this.getllHouseByHost();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getllHouseByHost() {
    const user = {
      id: this.currentUser.id
    };
    this.houseService.getAllHouseByUser(user).subscribe(listHouseOfHost => {
      this.listHouseOfHost = listHouseOfHost;
      this.billService.getAllBill().subscribe(listbill => {
        this.listBill = listbill;
        for (let i = 0; i < this.listHouseOfHost.length; i++) {
          // tslint:disable-next-line:prefer-for-of
          for (let j = 0; j < this.listBill.length; j++) {
            if (listbill[j].houseBill !== null) {
              if (listHouseOfHost[i].id === listbill[j].houseBill.id && listbill[j].status === 'Chờ chủ nhà xác nhận') {
                this.dem++;
              }
            }
          }
        }
      });
    });
  }
}
