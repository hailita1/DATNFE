import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../model/category';
import {CategoryService} from '../../service/category/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {OrdersService} from '../../service/order/orders.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {Product} from '../../model/product';
import {ProductService} from '../../service/product/product.service';
import {Orders} from '../../model/orders';
import {Review} from '../../model/review';
import {ReviewService} from '../../service/review/review.service';
import {BillService} from '../../service/bill/bill.service';
import {Bill} from '../../model/bill';
import {ItemBillComponent} from '../../host/bill/item-bill/item-bill.component';
import {ItemUserOrderComponent} from './item-user-order/item-user-order.component';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-user-order',
  templateUrl: './user-order.component.html',
  styleUrls: ['./user-order.component.scss']
})
export class UserOrderComponent implements OnInit {
  // @ts-ignore
  @ViewChild(ItemUserOrderComponent) view!: ItemUserOrderComponent;
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  currentUser: UserToken;
  listBill: Bill[] = [];
  bill: Bill;
  status: boolean;
  id: number;
  productId: number;
  star: number = 0;
  currentReview: Review;
  now = new Date().getTime();

  constructor(private categoryService: CategoryService,
              private router: Router,
              private billService: BillService,
              private  ordersService: OrdersService,
              private authenticationService: AuthenticationService,
              private productService: ProductService,
              private reviewService: ReviewService,
              private activatedRoute: ActivatedRoute) {
    this.getAllCategories();
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
    this.activatedRoute.params.subscribe(params => {
      this.status = (/true/i).test(params['status']);
      if (this.status === true) {
        this.getAllBillStatusTrue(this.currentUser.id);
      } else {
        this.getAllBillStatusFalse(this.currentUser.id);
      }
    });
  }

  ngOnInit() {
    let self = this;
    $(function() {
      $('.textarea').summernote();
      $('#modal-review').on('hidden.bs.modal', function() {
        $('.textarea').summernote('reset');
        self.star = 0;
      });
    });
  }

  rate(star: number) {
    if (this.star == star) {
      this.star = 0;
    } else {
      this.star = star;
    }
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  getOrderId(id: number) {
    this.id = id;
  }

  async getProductId(userId: number, productId: number) {
    this.productId = productId;
    this.currentReview = await this.getReview(userId, productId);
    if (this.currentReview != null) {
      $('#comment').summernote('pasteHTML', this.currentReview.comment);
      $('.textarea').summernote('disable');
    } else {
      $('#comment').summernote('reset');
      $('.textarea').summernote('enable');
    }
  }

  getReview(userId: number, productId: number) {
    return this.reviewService.getReviewByUserAndProduct(userId, productId).toPromise();
  }


  createReview(star: number, productId: number) {
    const review: Review = {
      comment: $('.textarea').val(),
      user: {
        id: this.currentUser.id
      },
      evaluate: star,
      product: {
        id: productId
      }
    };
    this.reviewService.createReview(review).subscribe(() => {
      $(function() {
        $('#modal-review').modal('hide');
      });
      this.star = 0;
      $('.textarea').summernote('reset');
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: 'Đánh giá thành công'
        });
      });
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
          title: 'Xảy ra lỗi khi đánh giá'
        });
      });
    });
  }

  getBill(item: Bill) {
    this.bill = item;
  }

  deleteBill() {
    const sd = new Date(this.bill.startDate).getTime();
    if (sd - this.now > 86400000) {
      this.billService.deleteBill(this.bill).subscribe(() => {
        this.billService.getAllBillByUserTrue(this.currentUser.id).subscribe(listBill => {
          this.listBill = listBill;
        });
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
            title: 'Hủy đơn đặt thành công'
          });
        });
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
            title: 'Hủy đơn đặt thất bại'
          });
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
          title: 'Đơn đặt chỉ được hủy trước 24h'
        });
      });
    }
  }

  getAllBillStatusTrue(id: number) {
    this.billService.getAllBillByUserTrue(id).subscribe(listBill => {
      this.listBill = listBill;
    });
  }

  getAllBillStatusFalse(id: number) {
    this.billService.getAllBillByFalse(id).subscribe(listBill => {
      this.listBill = listBill;
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }


  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address: address}});
  }
}
