import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../service/category/category.service';
import {User} from '../../model/user';
import {UserService} from '../../service/user/user.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-user',
  templateUrl: './item-user.component.html',
  styleUrls: ['./item-user.component.scss']
})
export class ItemUserComponent implements OnInit {

  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listcategorys: Array<any>;
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
  formName = 'tài khoản';

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private userService: UserService) {
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
        this.title = `Xác nhận thông tin ${this.formName}`;
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
    this.arrCheck = this.listcategorys;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        fullName: [{value: null, disabled: this.isInfo}, [Validators.required]],
        telephoneNumber: [{value: null, disabled: this.isInfo}, [Validators.required]],
        email: [{value: null, disabled: this.isInfo}, [Validators.required]],
        password: [{value: null, disabled: this.isInfo}],
      });
    } else {
      this.formGroup = this.fb.group({
        name: [{value: this.model.name, disabled: true}, [Validators.required]],
        status: [{value: this.model.status, disabled: this.isInfo}]
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
    let user: any;
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
      user = {
        name: this.formGroup.get('name').value,
        status: this.formGroup.get('status').value,
        id: this.model.id,
      };
    } else {
      user = {
        email: this.formGroup.value.email,
        password: this.formGroup.value.password,
        fullName: this.formGroup.value.fullName,
        telephoneNumber: this.formGroup.value.telephoneNumber,
        roles: [{
          id: 2,
          name: 'ROLE_ADMIN'
        }]
      };
    }
    if (this.isAdd) {
      this.userService.register(user).subscribe(res => {
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
