import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UsersRoutingModule} from './users-routing.module';
import {ListuserComponent} from './listuser/listuser.component';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ItemUserComponent} from './item-user/item-user.component';


@NgModule({
  declarations: [ListuserComponent, ItemUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule
  ]
})
export class UsersModule {
}
