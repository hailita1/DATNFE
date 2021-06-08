import {Component, OnInit, ViewChild} from '@angular/core';
import {UserToken} from '../../model/user-token';
import {CategoryService} from '../../service/category/category.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HouseService} from '../../service/house/house.service';
import {House} from '../../model/house';
import {BillService} from '../../service/bill/bill.service';
import {Bill} from '../../model/bill';
import {HouseDay} from '../../model/houseDay';
import {MatDialog} from '@angular/material';
import {ExampleDialogComponent} from './example-dialog/example-dialog.component';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  listHouseOfHost: House[];
  currentHouse: House;
  listBill: Bill[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  bill: Bill;
  listDelete: number[] = [];
  listFilterResult: Bill[] = [];
  listHouseDay: HouseDay[] = [];
  isSelected = true;
  idHouse: number;
  idHouseBill: any;
  minDate = new Date();

  constructor(private categoryService: CategoryService,
              private modalService: NgbModal,
              private billService: BillService,
              public dialog: MatDialog,
              private houseService: HouseService,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }

  openDialog(bill: Bill): void {
    const dialogRef = this.dialog.open(ExampleDialogComponent, {
      width: '1000px',
      data: bill
    });
  }

  ngOnInit() {
    this.getllHouseByHost();
    this.houseService.currentMessage.subscribe(id => {
      this.changeHouse(id);
    });
  }

  getBill(item: Bill) {
    this.bill = item;
  }

  checkAllCheckBox(ev) {
    this.listBill.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedCategory = [...this.listBill]
      .filter((bill) => bill.checked)
      .map((p) => p.id);
    if (selectedCategory.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteBill() {
    this.billService.deleteBill(this.bill).subscribe(res => {
      $(function() {
        $('#modal-delete').modal('hide');
      });
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: 'Xóa thành công'
        });
      });
      this.changeHouse(this.idHouse);
    }, () => {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Xóa thất bại'
        });
      });
    });
  }

  getllHouseByHost() {
    const user = {
      id: this.currentUser.id
    };
    this.houseService.getAllHouseByUser(user).subscribe(listHouseOfHost => {
      this.listHouseOfHost = listHouseOfHost;
    });
  }

  deleteListBill() {
    for (var i = 0; i < this.listBill.length; i++) {
      if (this.listBill[i].checked === true) {
        this.listDelete.push(this.listBill[i].id);
      }
    }
    this.billService.deleteListBill(this.listDelete).subscribe(res => {
        // this.getAllCategory();
        $(function() {
          $('#modal-delete-list').modal('hide');
        });
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Xóa thành công'
          });
        });
        this.listDelete = [];
        this.changeHouse(this.idHouse);
      },
      err => {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Xóa thất bại'
          });
        });
      });
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listBill = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listBill = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listBill = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }

  getHouse(id: number) {
    return this.houseService.getHouse(id).toPromise();
  }

  async changeHouse(event: any) {
    this.idHouse = event;
    const bill = {
      id: event
    };
    this.currentHouse = await this.getHouse(this.idHouse);
    this.billService.getAllHouseDayByHouse(bill).subscribe(listDateByHouse => {
      this.listHouseDay = listDateByHouse;
    });
    this.billService.getAllBillByHouse(bill).subscribe(listBill => {
      this.listBill = listBill;
      this.listFilterResult = this.listBill;
      $(function() {
        $('#table-category').DataTable({
          'paging': true,
          'lengthChange': true,
          'retrieve': true,
          'searching': true,
          'ordering': false,
          'info': false,
          'autoWidth': true,
        });
      });
    });
  }

  myDateFilter = (d: Date | null): boolean => {
    const day = (d || new Date());
    let isHide = false;
    for (let i = 0; i < this.listHouseDay.length; i++) {
      const date = new Date(this.listHouseDay[i].date);
      if ((day.getDate() === date.getDate()) && (day.getMonth() === date.getMonth()) && (day.getFullYear() === date.getFullYear())) {
        isHide = true;
        break;
      }
    }
    return !isHide;
  };
}
