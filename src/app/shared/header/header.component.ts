import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../service/category/category.service';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {Router} from '@angular/router';
import {Category} from '../../model/category';
import {UserToken} from '../../model/user-token';
import {Item} from '../../model/item';
import {UserService} from '../../service/user/user.service';
import {NotificationService} from '../../service/notification/notification.service';
import {User} from '../../model/user';
import {NotificationUser} from '../../model/notificationUser';
import {UserItemComponent} from './user-item/user-item.component';
import {ChagepasswordComponent} from './chagepassword/chagepassword.component';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // @ts-ignore
  @ViewChild(UserItemComponent) view!: UserItemComponent;

  // @ts-ignore
  @ViewChild(ChagepasswordComponent) viewPassword!: ChagepasswordComponent;
  listCategory: Category[] = [];
  currentUser: UserToken;
  user: User = {id: 0};
  hasRoleAdmin = false;
  hasRoleUser = false;
  items: Item[] = [];
  favoriteProduct: Item[] = [];
  listNotification: NotificationUser[] = [];

  constructor(private categoryService: CategoryService,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private notificationService: NotificationService,
              private router: Router) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
      }
    }
    this.loadFavorite();
  }

  ngOnInit() {
    $(function() {
      $('.dropdown-menu').click(function(event) {
        event.stopPropagation();
      });
    });
    this.getAllCategories();
    if (this.currentUser != null) {
      this.user.id = this.currentUser.id;
      setInterval(() => {
        this.getAllNotificationByUser();
        this.loadFavorite();
      }, 2000);
    }
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  initModalChagePass(model: any, type = null): void {
    this.viewPassword.view(model, type);
  }

  getAllCategories() {
    this.categoryService.getAllCategory().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }

  getAllNotificationByUser() {
    this.notificationService.getAllNotificationByUser(this.user).subscribe(listNotification => {
      this.listNotification = listNotification;
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  loadFavorite(): void {
    this.favoriteProduct = [];
    if (this.currentUser != null) {
      let heart = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
      if (heart != null) {
        for (var i = 0; i < heart.length; i++) {
          let item = JSON.parse(heart[i]);
          this.favoriteProduct.push({
            product: item.product
          });
        }
      }
    }
  }

  remove(id: number): void {
    let heart: any = JSON.parse(localStorage.getItem('heart-' + this.currentUser.id));
    let index: number = -1;
    for (var i = 0; i < heart.length; i++) {
      let item: Item = JSON.parse(heart[i]);
      if (item.product.id == id) {
        heart.splice(i, 1);
        break;
      }
    }
    localStorage.setItem('heart-' + this.currentUser.id, JSON.stringify(heart));
    this.loadFavorite();
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

  getNotification(id: number) {
    return this.notificationService.getNotification(id).toPromise();
  }
}
