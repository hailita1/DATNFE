import {Component, OnInit} from '@angular/core';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {CategoryService} from '../../service/category/category.service';
import {Router} from '@angular/router';
import {VoucherService} from '../../service/voucher/voucher.service';
import {Voucher} from '../../model/voucher';
import {UserToken} from '../../model/user-token';
import {AuthenticationService} from '../../service/auth/authentication.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {

  listCategory: Category[] = [];
  listVoucher: Voucher[] = [];
  page = 1;
  pageSize = 8;
  currentUser: UserToken;
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  messageForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl('')
  });

  constructor(private categoryService: CategoryService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private voucherService: VoucherService) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    $('.hero__categories__all').on('click', function() {
      $('.hero__categories ul').slideToggle(400);
    });
    this.getAllCategories();
    this.getAllVoucher();
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

  getAllVoucher() {
    this.voucherService.getAllVoucher().subscribe(listVoucher => {
      this.listVoucher = listVoucher;
    });
  }
}
