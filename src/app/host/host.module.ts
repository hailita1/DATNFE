import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HostRoutingModule} from './host-routing.module';
import {HouseComponent} from './house/house.component';
import {CategoryComponent} from './category/category.component';
import {ServiceComponent} from './service/service.component';
import {BillComponent} from './bill/bill.component';
import {UtilitiesComponent} from './utilities/utilities.component';
import {CategoryItemComponent} from './category/category-item/category-item.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModalModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ServiceItemComponent} from './service/service-item/service-item.component';
import {UtilitiesItemComponent} from './utilities/utilities-item/utilities-item.component';
import {ItemHouseComponent} from './house/item-house/item-house.component';
import {NgImageSliderModule} from 'ng-image-slider';
import {ItemBillComponent} from './bill/item-bill/item-bill.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {MatDatepickerModule, MatDialogModule, MatDividerModule, MatInputModule, MatNativeDateModule} from '@angular/material';
import {ExampleDialogComponent} from './bill/example-dialog/example-dialog.component';

@NgModule({
  declarations: [HouseComponent, CategoryComponent, ServiceComponent, BillComponent, UtilitiesComponent, CategoryItemComponent, ServiceItemComponent, UtilitiesItemComponent, ItemHouseComponent, ItemBillComponent, ExampleDialogComponent],
  entryComponents: [ExampleDialogComponent],
  imports: [
    CommonModule,
    HostRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModalModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbPaginationModule,
    NgImageSliderModule,
    CKEditorModule,
    MatDialogModule,
    MatDividerModule
  ]
})
export class HostModule {
}
