import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../service/category/category.service';
import {Category} from '../../model/category';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {UserToken} from '../../model/user-token';
import {ShoppingCartService} from '../../service/shopping-cart/shopping-cart.service';
import {ItemService} from '../../service/item/item.service';
import {House} from '../../model/house';
import {HouseService} from '../../service/house/house.service';
import {QuickviewComponent} from './quickview/quickview.component';

declare var $: any;

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  // @ts-ignore
  @ViewChild(QuickviewComponent) view!: QuickviewComponent;
  listHouse: House[] = [];
  listHouseFilter: House[] = [];
  listCategory: Category[] = [];
  searchForm: FormGroup = new FormGroup({
    name: new FormControl('')
  });
  listHouseLatest: House[] = [];
  listFilterResult: House[] = [];
  listHouseDiscount: House[] = [];
  listHouseNumberHire: House[] = [];
  currentUser: UserToken;
  searchKeyWord: any;
  conditsion: boolean;
  isCheck = true;

  constructor(private houseService: HouseService,
              private categoryService: CategoryService,
              private authenticationService: AuthenticationService,
              private shoppingCartService: ShoppingCartService,
              private itemService: ItemService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit() {
    // tslint:disable-next-line:only-arrow-functions
    $(document).ready(function() {
      $('.latest-product__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        dots: false,
        nav: true,
        navText: ['<span class=\'fa fa-angle-left\'><span/>', '<span class=\'fa fa-angle-right\'><span/>'],
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true
      });
      // tslint:disable-next-line:only-arrow-functions
      $('.hero__categories__all').on('click', function() {
        $('.hero__categories ul').slideToggle(400);
      });
      $('.categories__slider').owlCarousel({
        loop: true,
        margin: 0,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<span class=\'fa fa-angle-left\'><span/>', '<span class=\'fa fa-angle-right\'><span/>'],
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        smartSpeed: 1200,
        autoHeight: false,
        autoplay: true,
        responsive: {

          0: {
            items: 1,
          },

          480: {
            items: 2,
          },

          768: {
            items: 3,
          },

          992: {
            items: 4,
          }
        }
      });
    });
    this.getAllHouseLatest();
    this.getAllHouse();
    this.getAllCategories();
    this.getAllHouseDiscount();
    this.getAllHouseNumberHiresDesc();
  }

  getAllHouse() {
    this.houseService.getAllHouseStatusTrue().subscribe(listHouse => {
      this.listHouseFilter = listHouse;
      if (listHouse.length > 8) {
        for (let i = 0; i < 8; i++) {
          this.listHouse.push(listHouse[i]);
        }
      } else {
        this.listHouse = listHouse;
      }
    });
  }

  getAllCategories() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  initModal(model: any): void {
    this.view.view(model);
  }

  getAllHouseLatest() {
    this.houseService.getAllHouseStatusTrue().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseLatest.push(listHouse[i]);
        }
      } else {
        this.listHouseLatest = listHouse;
      }
    });
  }

  getAllHouseDiscount() {
    this.houseService.findByStatusTrueOrderByDiscountDesc().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseDiscount.push(listHouse[i]);
        }
      } else {
        this.listHouseDiscount = listHouse;
      }
    });
  }

  getAllHouseNumberHiresDesc() {
    this.houseService.findByOrderByNumberHiresDesc().subscribe(listHouse => {
      if (listHouse.length > 4) {
        for (let i = 0; i < 4; i++) {
          this.listHouseNumberHire.push(listHouse[i]);
        }
      } else {
        this.listHouseNumberHire = listHouse;
      }
    });
  }

  search() {
    const address = this.searchForm.value.name;
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchHN() {
    const address = 'Hà Nội';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchDN() {
    const address = 'Đà Nẵng';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchHCM() {
    const address = 'Hồ Chí Minh';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchQN() {
    const address = 'Quảng Ninh';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchVT() {
    const address = 'Vũng Tàu';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchDL() {
    const address = 'Đà Lạt';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchHA() {
    const address = 'Hội An';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  searchNT() {
    const address = 'Nha Trang';
    this.router.navigate(['../houses'], {queryParams: {address}});
  }

  filterKeyWord() {
    var filterResult = [];
    this.conditsion = true;
    this.isCheck = false;
    if (this.searchKeyWord.length === 0) {
      this.isCheck = true;
    } else {
      this.listFilterResult = this.listHouseFilter;
      var keyWord = this.searchKeyWord.toLowerCase();
      this.listFilterResult.map(item => {
        var address = item.address.toLowerCase();
        if (address.includes(keyWord)) {
          filterResult.push(item);
        }
      });
    }
    this.listFilterResult = filterResult;
    if (this.listFilterResult.length !== 0) {
      this.conditsion = true;
    } else {
      this.conditsion = false;
    }
  }

  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      console.log(pos);
      if (pos > 0) {
        window.scrollTo(0, pos - 1000);
      } else {
        console.log('oke');
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }

}
