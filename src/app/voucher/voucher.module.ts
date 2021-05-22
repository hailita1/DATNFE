import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VoucherRoutingModule} from './voucher-routing.module';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { VoucherComponent } from './voucher/voucher.component';
import { ItemVoucherComponent } from './item-voucher/item-voucher.component';


@NgModule({
  declarations: [VoucherComponent, ItemVoucherComponent],
  imports: [
    CommonModule,
    VoucherRoutingModule, NgbModalModule, FormsModule, ReactiveFormsModule
  ]
})
export class VoucherModule {
}
