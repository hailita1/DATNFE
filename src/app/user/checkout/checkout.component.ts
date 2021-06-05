import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {Item} from '../../model/item';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {UserToken} from '../../model/user-token';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {ServiceService} from '../../service/service/service.service';
import {Service} from '../../model/service';
import {HouseService} from '../../service/house/house.service';
import {BillService} from '../../service/bill/bill.service';
import {House} from '../../model/house';
import {Bill} from '../../model/bill';
import {HouseDay} from '../../model/houseDay';
import {Voucher} from '../../model/voucher';
import {VoucherService} from '../../service/voucher/voucher.service';
import {ICreateOrderRequest, IPayPalConfig, ITransactionItem} from 'ngx-paypal';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  listCategory: Category[] = [];
  listService: Service[] = [];
  bill: Bill;
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  billForm: FormGroup = new FormGroup({
    nameUser: new FormControl(''),
    telephoneNumber: new FormControl(''),
    email: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    voucher: new FormControl(''),
    service: new FormControl(''),
  });
  items: Item[] = [];
  currentUser: UserToken;
  isSubmitted = false;
  idHouse: any;
  listServiceOfHouse: Service[] = [];
  listHouseDay: HouseDay[] = [];
  listVoucher: Voucher[] = [];
  page = 1;
  pageSize = 5;
  idUser: any;
  isLoading = false;
  currentHouse: House = {price: 0};
  minDate = new Date();
  voucher: Voucher;
  totalPrice = 0;
  priceService = 0;
  priceHomStay = 0;
  checkPay: boolean;
  rate = 23000;

  constructor(private categoryService: CategoryService,
              private billService: BillService,
              private authenticationService: AuthenticationService,
              private houseService: HouseService, private activatedRoute: ActivatedRoute,
              private voucherService: VoucherService,
              private serviceService: ServiceService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  async ngOnInit() {
    this.initConfig();
    $(document).ready(function() {
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
    });
    this.getAllCategories();
    this.getBill();
    this.houseService.currentMessage.subscribe(id => this.idHouse = id);
    this.idUser = JSON.parse(localStorage.getItem('user') || '{id}').id;
    if (this.idHouse !== null && this.idHouse !== undefined) {
      this.currentHouse = await this.getHouse(this.idHouse);
      this.getAllHouseDayByHouse(this.idHouse);
      this.getAllService(this.idHouse);
    }
    this.getAllVoucher();
  }

  private initConfig(): void {
    this.checkPay = false;
    this.payPalConfig = {
      clientId: 'AcQjAylT-DgZJT3CmfhB38y70DGNF3eCRz3fBF945BNJgs45oJqpEOY-5Oxm5Uqfb4hkGpSYLfuQQAKF',
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [
          {
            payee: {
              email_address: 'hailit2306@gmail.com',
              merchant_id: 'V9DD9A2JNSLMU',
            },

            amount: {
              currency_code: 'USD',
              value: String((this.totalPrice * 0.5 / this.rate).toFixed(0)),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: String((this.totalPrice * 0.5 / this.rate).toFixed(0)),
                }
              },
            },
          },
        ],
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'horizontal',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        if (data.status === 'COMPLETED') {
          console.log('Thành Công');
        }
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        this.checkPay = true;
        if (this.voucher != null || this.voucher !== undefined) {
          if (this.voucher.typeVoucher === '0') {
            // tslint:disable-next-line:max-line-length
            this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100) - this.voucher.discount;
          } else {
            // tslint:disable-next-line:max-line-length
            this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100) * ((100 - this.voucher.discount) / 100);
          }
        } else {
          this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100);
        }
      },
    };
  }


  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getHouse(id: number) {
    return this.houseService.getHouse(id).toPromise();
  }

  getAllService(idHouse: number) {
    const house = {
      id: idHouse
    };
    this.serviceService.getAllServiceStatusTrue(house).subscribe(listService => {
      this.listService = listService;
    });
  }

  getAllHouseDayByHouse(idHouse: number) {
    const houseDay = {
      id: idHouse
    };
    this.billService.getAllHouseDayByHouse(houseDay).subscribe(listDateByHouse => {
      this.listHouseDay = listDateByHouse;
    });
  }

  getBill() {
    this.billService.getAllBill().subscribe(bill => {
      this.bill = bill[0];
    });
  }

  async submitCheckoutForm() {
    let bill: any;
    const sd = new Date(this.billForm.get('startDate').value).getTime();
    const ed = new Date(this.billForm.get('endDate').value).getTime();
    // tslint:disable-next-line:max-line-length
    if (this.billForm.get('nameUser').value != '' && this.billForm.get('telephoneNumber').value != '' && this.billForm.get('startDate').value != ''
      && this.billForm.get('endDate').value != '' && this.billForm.get('email').value != '') {
      this.isSubmitted = true;
      if (this.voucher != null || this.voucher !== undefined) {
        if (this.voucher.typeVoucher === '0') {
          // tslint:disable-next-line:max-line-length
          this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100) - this.voucher.discount;
        } else {
          // tslint:disable-next-line:max-line-length
          this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100) * ((100 - this.voucher.discount) / 100);
        }
      } else {
        this.totalPrice = (this.priceService + this.priceHomStay * (100 - this.currentHouse.discount) / 100);
      }
      bill = {
        id: this.bill.id + 1,
        nameUser: this.billForm.get('nameUser').value,
        telephoneNumber: this.billForm.get('telephoneNumber').value,
        startDate: this.billForm.get('startDate').value,
        endDate: this.billForm.get('endDate').value,
        email: this.billForm.get('email').value,
        status: false,
        user: {
          id: this.idUser
        },
        houseBill: {
          id: this.idHouse
        },
        service: this.listServiceOfHouse,
        totalPrice: this.totalPrice,
        voucher: this.voucher ? this.voucher.discount : null
      };
    }
    if (this.isSubmitted) {
      if (sd > ed) {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Ngày đến thuê phải nhỏ hơn ngày trả phòng'
          });
        });
        this.isLoading = false;
      } else if ((ed - sd) < 86400000) {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: 'error',
            title: 'Đặt phòng ít nhất 1 ngày'
          });
        });
        this.isLoading = false;
      } else {
        if (this.checkPay === true) {
          this.isLoading = true;
          this.billService.createBill(bill).subscribe(res => {
              $(function() {
                const Toast = Swal.mixin({
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
                Toast.fire({
                  type: 'success',
                  title: 'Đơn đặt đã tạo, vui lòng chờ xác nhận'
                });
              });
              this.billForm.reset();
              this.isLoading = false;
              this.listServiceOfHouse = [];
              this.priceService = 0;
              this.priceHomStay = 0;
              this.currentHouse.price = 0;
              this.currentHouse.discount = 0;
              this.voucher.discount = 0;
              this.voucher.title = '';
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
                  title: 'Đơn đặt của bạn thất bại'
                });
              });
              this.isLoading = false;
            });
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
              title: 'Bạn cần đặt cọc 50% tổng đơn đặt'
            });
          });
        }
      }
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
          title: 'Bạn hãy điền đầy đủ thông tin'
        });
      });
      this.isLoading = false;
    }
  }

  addServiceToHouse(id) {
    const utilitie1 = this.listService
      .filter((utilitie) => utilitie.id == id);

    const utilitie2 = this.listServiceOfHouse
      .filter((utilitie) => utilitie1[0].id == utilitie.id);
    if (utilitie2.length == 0) {
      this.listServiceOfHouse.push(utilitie1[0]);
    }
    console.log(this.listServiceOfHouse);
    this.countPrice();
  }

  countPrice() {
    // tslint:disable-next-line:prefer-const
    this.priceService = 0;
    for (let i = 0; i < this.listServiceOfHouse.length; i++) {
      this.priceService += this.listServiceOfHouse[i].price;
    }
  }

  delete(event: any) {
    const indexOfItem = this.listServiceOfHouse.indexOf(event);
    this.listServiceOfHouse.splice(indexOfItem, 1);
    this.countPrice();
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  myDateFilter = (d: Date | null): boolean => {
    const sd = new Date(this.billForm.get('startDate').value).getTime();
    const ed = new Date(this.billForm.get('endDate').value).getTime();
    this.priceHomStay = (((ed - sd) / 86400000)) * this.currentHouse.price;
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

  getAllVoucher() {
    this.voucherService.getAllVoucher().subscribe(listVoucher => {
      this.listVoucher = listVoucher;
    });
  }

  checkVoucher() {
    // tslint:disable-next-line:prefer-const
    let code, index = -1;
    code = this.billForm.get('voucher').value;
    for (let i = 0; i < this.listVoucher.length; i++) {
      if (code === (this.listVoucher[i].voucher_code).toUpperCase()) {
        index = i;
        break;
      }
    }
    if (index != -1) {
      this.voucher = this.listVoucher[index];
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          type: 'success',
          title: 'Mã voucher chính xác'
        });
      });
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
          title: 'Mã voucher không chính xác'
        });
      });
    }
  }
}
