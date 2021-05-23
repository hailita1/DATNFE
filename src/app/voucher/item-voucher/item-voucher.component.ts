import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../service/category/category.service';
import {VoucherService} from '../../service/voucher/voucher.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-voucher',
  templateUrl: './item-voucher.component.html',
  styleUrls: ['./item-voucher.component.scss']
})
export class ItemVoucherComponent implements OnInit {
  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listVoucher: Array<any>;
  @Output() eventEmit: EventEmitter<any> = new EventEmitter<any>();
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  isAdd = false;
  isEdit = false;
  isInfo = false;
  title = '';
  type: any;
  status;

  model: any;
  submitted = false;
  arrCheck = [];
  formGroup: FormGroup;
  formName = 'voucher';

  constructor(private modalService: NgbModal, private fb: FormBuilder, private  voucherService: VoucherService) {
  }

  updateFormType(type: any) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.title = `Thêm mới thông tin ${this.formName}`;
        break;
      case 'show':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.title = `Xem chi tiết thông tin ${this.formName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.title = `Sửa thông tin ${this.formName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        break;
    }
  }

  ngOnInit(): void {
    this.submitted = false;
  }

  view(model: any, type = null): void {
    this.arrCheck = this.listVoucher;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        voucher_code: [{value: null, disabled: this.isInfo}, [Validators.required]],
        title: [{value: null, disabled: this.isInfo}, [Validators.required]],
        discount: [{value: null, disabled: this.isInfo}, [Validators.required]],
        startDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        expiredDate: [{value: null, disabled: this.isInfo}, [Validators.required]],
        category: [{value: null, disabled: this.isInfo}, [Validators.required]],
      });
    } else {
      this.formGroup = this.fb.group({
        voucher_code: [{value: this.model.voucher_code, disabled: this.isInfo}, [Validators.required]],
        title: [{value: this.model.title, disabled: this.isInfo}, [Validators.required]],
        discount: [{value: this.model.discount, disabled: this.isInfo}, [Validators.required]],
        startDate: [{value: this.model.startDate, disabled: this.isInfo}, [Validators.required]],
        expiredDate: [{value: this.model.expiredDate, disabled: this.isInfo}, [Validators.required]],
        category: [{value: this.model.typeVoucher, disabled: this.isInfo}, [Validators.required]],
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'sl',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  save() {
    let voucher: any;
    this.submitted = true;
    if (this.formGroup.invalid) {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Kiểm tra thông tin các trường đã nhập'
        });
      });
      return;
    }
    if (this.isEdit) {
      voucher = {
        voucher_code: this.formGroup.get('voucher_code').value,
        title: this.formGroup.get('title').value,
        discount: this.formGroup.get('discount').value,
        startDate: this.formGroup.get('startDate').value,
        expiredDate: this.formGroup.get('expiredDate').value,
        typeVoucher: this.formGroup.get('category').value,
        status: true,
        id: this.model.id,
      };
    } else {
      voucher = {
        voucher_code: this.formGroup.get('voucher_code').value,
        title: this.formGroup.get('title').value,
        discount: this.formGroup.get('discount').value,
        startDate: this.formGroup.get('startDate').value,
        expiredDate: this.formGroup.get('expiredDate').value,
        typeVoucher: this.formGroup.get('category').value,
        status: true,
      };
    }
    if (this.isAdd) {
      this.voucherService.createVoucher(voucher).subscribe(res => {
          this.closeModalReloadData();
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Thêm mới thành công'
            });
          });
          this.modalReference.dismiss();
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
              title: 'Thêm mới thất bại'
            });
          });
        });
    }
    if (this.isEdit) {
      this.voucherService.updateVoucher(voucher.id, voucher).subscribe(res => {
          this.closeModalReloadData();
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Cập nhật thành công'
            });
          });
          this.modalReference.dismiss();
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
              title: 'Cập nhật thất bại'
            });
          });
        });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit('success');
  }


}
