import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../helper/auth-guard';
import {VoucherComponent} from './voucher/voucher.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: VoucherComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VoucherRoutingModule {
}
