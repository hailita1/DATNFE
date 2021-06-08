import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {Bill} from '../../../model/bill';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserToken} from '../../../model/user-token';
import {HouseDay} from '../../../model/houseDay';
import {BillService} from '../../../service/bill/bill.service';
import {CategoryService} from '../../../service/category/category.service';
import {HouseService} from '../../../service/house/house.service';
import {ServiceService} from '../../../service/service/service.service';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UsageBillService} from '../../../service/usageBill/usage-bill.service';
import {Service} from '../../../model/service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-example-dialog',
  templateUrl: './example-dialog.component.html',
  styleUrls: ['./example-dialog.component.scss']
})
export class ExampleDialogComponent implements OnInit {
  @Output() eventEmit = new EventEmitter<any>();
  formGroup: FormGroup;
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  bill: any;
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  listService: Service[] = [];
  listServiceHouse: Service[] = [];
  listServiceOfHouse: Service[] = [];
  page = 1;
  pageSize = 2;
  submitted = false;
  priceHomeStay: number;
  priceService: 0;
  totalPrice: number;
  grid: any = {
    rowData: []
  };
  listHouseDay: HouseDay[] = [];
  minDate = new Date();
  endDateFinal: Date;
  checkDate: number;
  private date: Date;

  constructor(
    public dialogRef: MatDialogRef<ExampleDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Bill,
    private fb: FormBuilder,
    private usageBillService: UsageBillService,
    private categoryService: CategoryService,
    private billService: BillService,
    private houseService: HouseService,
    private serviceService: ServiceService,
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
    if (this.data.status == 'Đã thanh toán') {
      this.formGroup = fb.group({
        nameUser: [{value: this.data.nameUser, disabled: true}, Validators.required],
        telephoneNumber: [{value: this.data.telephoneNumber, disabled: true}, Validators.required],
        totalPrice: [{value: this.data.totalPrice / 2, disabled: true}, Validators.required],
        email: [{value: this.data.email, disabled: true}, Validators.required],
        bookingDate: [{value: this.data.bookingDate, disabled: true}, Validators.required],
        startDate: [{value: this.data.startDate, disabled: true}, Validators.required],
        endDate: [{value: this.data.endDate, disabled: true}, Validators.required],
        service: [null, Validators.required],
      });
    } else {
      this.formGroup = fb.group({
        nameUser: [{value: this.data.nameUser, disabled: true}, Validators.required],
        telephoneNumber: [{value: this.data.telephoneNumber, disabled: true}, Validators.required],
        totalPrice: [{value: this.data.totalPrice / 2, disabled: true}, Validators.required],
        email: [{value: this.data.email, disabled: true}, Validators.required],
        bookingDate: [{value: this.data.bookingDate, disabled: true}, Validators.required],
        startDate: [{value: this.data.startDate, disabled: true}, Validators.required],
        endDate: [{value: this.data.endDate, disabled: false}, Validators.required],
        service: [null, Validators.required],
      });
    }
  }

  ngOnInit() {
    this.listServiceOfHouse = this.data.service;
    const house = {
      id: this.data.houseBill.id
    };
    this.serviceService.getAllServiceStatusTrue(house).subscribe(listService => {
      this.listServiceHouse = listService;
    });

    const bill = {
      endDate: this.data.endDate,
      houseBill: {
        id: this.data.houseBill.id
      }
    };
    this.billService.getAllHouseDayByHouseBill(bill).subscribe(listDateByHouse => {
      this.listHouseDay = listDateByHouse;
    });
    this.priceService = 0;
    for (let i = 0; i < this.listServiceOfHouse.length; i++) {
      this.priceService += this.listServiceOfHouse[i].price;
    }
  }


  addServiceToHouse(id) {
    const utilitie1 = this.listServiceHouse
      .filter((utilitie) => utilitie.id == id);

    const utilitie2 = this.listServiceOfHouse
      .filter((utilitie) => utilitie1[0].id == utilitie.id);
    if (utilitie2.length == 0) {
      this.listServiceOfHouse.push(utilitie1[0]);
    }
    this.countPrice();
  }

  addMeta(event: any) {
    const model = {
      name: '',
      price: '',
      status: true,
    };
    this.grid.rowData.push(model);
  }

  btnDeleteClickedHandler(event: any) {
    const indexOfItem = this.grid.rowData.indexOf(event);
    this.grid.rowData.splice(indexOfItem, 1);
  }

  countPrice() {
    // tslint:disable-next-line:prefer-const
    this.priceService = 0;
    for (let i = 0; i < this.listServiceOfHouse.length; i++) {
      this.priceService += this.listServiceOfHouse[i].price;
    }
  }

  addService() {
    this.grid.rowData.map((item) => {
      if (item.price > 0) {
        this.listServiceOfHouse.push(item);
        this.countPrice();
      } else {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Kiểm tra lại giá dịch vụ'
          });
        });
      }
    });
  }

  PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'height=' + screen.height + ',width=' + screen.width + ' fullscreen=yes');
    mywindow.document.write('<html>');
    mywindow.document.write('<head>');
    mywindow.document.write('<link rel="stylesheet" href="../../../../assets/static/css/bootstrap.min.css" type="text/css">');
    mywindow.document.write('<link media="all" rel="stylesheet" href="../../../../assets/static/css/styleprint.css"/>');
    mywindow.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"/>');
    mywindow.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');
    mywindow.document.write('<script media="all" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>');
    mywindow.document.write('</head>');
    mywindow.document.write('<body >');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    if (this.data.voucher != null || this.data.voucher !== undefined) {
      if (this.data.voucher > 100) {
        // tslint:disable-next-line:max-line-length
        this.totalPrice = (this.priceService + this.priceHomeStay) - this.data.voucher;
      } else {
        // tslint:disable-next-line:max-line-length
        this.totalPrice = (this.priceService + this.priceHomeStay) * ((100 - this.data.voucher) / 100);
      }
    } else {
      this.totalPrice = (this.priceService + this.priceHomeStay);
    }
    this.bill = {
      nameUser: this.data.nameUser,
      telephoneNumber: this.data.telephoneNumber,
      bookingDate: this.data.bookingDate,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      endDateFinal: this.formGroup.get('endDate').value,
      email: this.data.email,
      totalPrice: this.totalPrice,
      service: JSON.stringify(this.listServiceOfHouse),
      bill: {id: this.data.id},
      voucher: this.data.voucher,
      houseBill: {
        id: this.data.houseBill.id
      },
    };
    let bill;
    bill = {
      id: this.data.id
    };
    this.usageBillService.createUsageBill(this.bill).subscribe(res1 => {
      this.billService.pay(bill).subscribe(res => {
        setTimeout(function() {
          mywindow.print();
          mywindow.close();
        }, 1000);
        this.createMessage();
        this.dialogRef.close();
      });
    });
  }

  myDateFilter = (d: Date | null): boolean => {
    this.checkDate = 0;
    this.priceHomeStay = 0;
    const sd = new Date(this.formGroup.get('startDate').value).getTime();
    const ed = new Date(this.formGroup.get('endDate').value).getTime();
    this.endDateFinal = new Date(this.formGroup.get('endDate').value);
    this.date = new Date(this.data.endDate);
    if (this.date.getTime() - ed > 0) {
      this.checkDate = 1;
    } else {
      this.checkDate = 2;
    }
    this.priceHomeStay = ((((ed - sd) / 86400000)) * this.data.houseBill.price) * ((100 - this.data.houseBill.discount) / 100);
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

  onNoClick(): void {
    this.listServiceOfHouse = [];
    this.dialogRef.close();
  }

  createMessage() {
    this.houseService.changeMessage(this.data.houseBill.id);
  }
}
