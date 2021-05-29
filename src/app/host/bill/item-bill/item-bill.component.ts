import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UserToken} from '../../../model/user-token';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../../service/category/category.service';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {BillService} from '../../../service/bill/bill.service';
import {NotificationService} from '../../../service/notification/notification.service';
import {HouseService} from '../../../service/house/house.service';
import {Bill} from '../../../model/bill';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-bill',
  templateUrl: './item-bill.component.html',
  styleUrls: ['./item-bill.component.scss']
})
export class ItemBillComponent implements OnInit {

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private billService: BillService,
              private categoryService: CategoryService,
              private houseService: HouseService,
              private notificationService: NotificationService,
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

  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listcategorys: Array<any>;
  @Output() eventEmit: EventEmitter<any> = new EventEmitter<any>();
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  isAdd = false;
  isEdit = false;
  isInfo = false;
  title = '';
  type: any;
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  listService: any[] = [];
  page = 1;
  pageSize = 2;
  model: any;
  submitted = false;
  idHouse: number;
  arrCheck = [];
  formGroup: FormGroup;
  formName = 'Đơn đặt HomeStay';
  currentDate = new Date();
  priceHomeStay: number;
  priceService: 0;
  itemPrint: Bill;

  updateFormType(type: any) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.title = `Thêm mới thông tin ${this.formName}`;
        break;
      case 'show':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.title = `Xem thông tin chi tiết ${this.formName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.title = `Xác nhận đơn đặt ${this.formName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        break;
    }
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  view(model: any, type = null): void {
    this.priceService = 0;
    this.listService = model.service;
    this.idHouse = model.houseBill.id;
    this.arrCheck = this.listcategorys;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    const sd = new Date(this.model.startDate).getTime();
    const ed = new Date(this.model.endDate).getTime();
    this.priceHomeStay = ((((ed - sd) / 86400000) + 1) * model.houseBill.price) * ((100 - model.houseBill.discount) / 100);
    console.log(model.service);
    if (model.service != null) {
      for (let i = 0; i < model.service.length; i++) {
        this.priceService = this.priceService + model.service[i].price;
      }
    } else {
      this.priceService = 0;
    }

    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        nameUser: [{value: null, disabled: this.isInfo}, [Validators.required]],
        telephoneNumber: [{value: null, disabled: this.isInfo}, [Validators.required]],
        bookingDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        startDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        endDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        email: [{value: null, disabled: this.isInfo}, [Validators.required]],
        totalPrice: [{value: null, disabled: this.isInfo}, [Validators.required]],
        status: [{value: false, disabled: true}],
      });
    } else {
      this.formGroup = this.fb.group({
        nameUser: [{value: this.model.nameUser, disabled: true}, [Validators.required]],
        telephoneNumber: [{value: this.model.telephoneNumber, disabled: true}, [Validators.required]],
        bookingDate: [{value: this.model.bookingDate, disabled: true}, [Validators.required]],
        startDate: [{value: this.model.startDate, disabled: true}, [Validators.required]],
        endDate: [{value: this.model.endDate, disabled: true}, [Validators.required]],
        email: [{value: this.model.email, disabled: true}, [Validators.required]],
        totalPrice: [{value: this.model.totalPrice, disabled: true}, [Validators.required]],
        status: [{value: this.model.status, disabled: this.isInfo}],
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  save() {
    let bill: any;
    this.submitted = true;
    if (this.formGroup.invalid) {
      // tslint:disable-next-line:only-arrow-functions
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Kiểm tra thông tin các trường đã nhập'
        });
      });
      return;
    }
    if (this.isEdit) {
      bill = {
        nameUser: this.formGroup.get('nameUser').value,
        telephoneNumber: this.formGroup.get('telephoneNumber').value,
        bookingDate: this.formGroup.get('bookingDate').value,
        startDate: this.formGroup.get('startDate').value,
        endDate: this.formGroup.get('endDate').value,
        email: this.formGroup.get('email').value,
        totalPrice: this.formGroup.get('totalPrice').value,
        id: this.model.id,
        houseBill: {id: this.idHouse}
      };
    } else {
      bill = {
        name: this.formGroup.get('name').value,
        status: this.formGroup.get('status').value,
      };
    }
    if (this.isAdd) {
      this.categoryService.createCategory(bill).subscribe(res => {
          this.closeModalReloadData();
          // tslint:disable-next-line:only-arrow-functions
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Thêm mới thành công'
            });
          });
          this.modalReference.dismiss();
        },
        err => {
          // tslint:disable-next-line:only-arrow-functions
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'error',
              title: 'Thêm mới thất bại'
            });
          });
        });
    }
    if (this.isEdit) {
      // tslint:disable-next-line:triple-equals
      if (this.model.status == 'Chờ chủ nhà xác nhận') {
        this.billService.confirmBillByHost(bill).subscribe(res => {
            this.closeModalReloadData();
            // tslint:disable-next-line:only-arrow-functions
            $(function() {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });

              Toast.fire({
                type: 'success',
                title: 'Cập nhật thành công'
              });
            });
            this.createNotification();
            this.updateNumberHires();
            this.modalReference.dismiss();
          },
          err => {
            // tslint:disable-next-line:only-arrow-functions
            $(function() {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });

              Toast.fire({
                type: 'error',
                title: 'Cập nhật thất bại'
              });
            });
          });
      } else {
        // tslint:disable-next-line:only-arrow-functions
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Chủ nhà không có quyển xác nhận đơn đặt này'
          });
        });
        this.modalReference.dismiss();
      }
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit(this.idHouse);
  }

  createNotification() {
    const notification = {
      content: 'Thuê nhà thành công',
      status: true,
      user: [
        {
          email: this.model.user.email,
          id: this.model.user.id,
        }
      ]
    };
    this.notificationService.createNotification(notification).subscribe();
  }

  updateNumberHires() {
    const house = {
      id: this.model.houseBill.id,
      numberHires: this.model.houseBill.numberHires + 1
    };
    this.houseService.updateNumberHires(house).subscribe();
  }

  PrintElem(elem) {
    var mywindow = window.open('', 'PRINT', 'height=' + screen.height + ',width=' + screen.width + ' fullscreen=yes');
    mywindow.document.write('<html>');
    mywindow.document.write('<head>');
    mywindow.document.write('<link rel="stylesheet" href="../../../../assets/static/css/bootstrap.min.css" type="text/css">');
    mywindow.document.write('<link media="all" rel="stylesheet" href="../../../../assets/static/css/styleprint.css"/>');
    mywindow.document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>');
    mywindow.document.write('<script media="all" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>');
    mywindow.document.write('</head>');
    mywindow.document.write('<body >');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    setTimeout(function() {
      mywindow.print();
      mywindow.close();
    }, 1000);
    let bill;
    bill = {
      id: this.model.id
    };
    this.billService.pay(bill).subscribe(res => {
      this.closeModalReloadData();
    });
  }
}
