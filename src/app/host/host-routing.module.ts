import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HouseComponent} from './house/house.component';
import {CategoryComponent} from './category/category.component';
import {ServiceComponent} from './service/service.component';
import {BillComponent} from './bill/bill.component';
import {UtilitiesComponent} from './utilities/utilities.component';
import {AuthGuard} from '../helper/auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'house',
    pathMatch: 'full'
  },
  {
    path: 'house',
    canActivate: [AuthGuard],
    component: HouseComponent,
  }, {
    path: 'category',
    canActivate: [AuthGuard],
    component: CategoryComponent,
  }, {
    path: 'service',
    canActivate: [AuthGuard],
    component: ServiceComponent,
  }, {
    path: 'bill',
    canActivate: [AuthGuard],
    component: BillComponent,
  }, {
    path: 'utilities',
    canActivate: [AuthGuard],
    component: UtilitiesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HostRoutingModule {
}
