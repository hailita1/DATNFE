import {Component, OnInit, ViewChild} from '@angular/core';
import {UserToken} from '../../model/user-token';

;
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../service/auth/authentication.service';
import {ItemVoucherComponent} from '../item-voucher/item-voucher.component';
import {Voucher} from '../../model/voucher';
import {VoucherService} from '../../service/voucher/voucher.service';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.scss']
})
export class VoucherComponent implements OnInit {

  // @ts-ignore
  @ViewChild(ItemVoucherComponent) view!: ItemVoucherComponent;
  listVoucher: Voucher[];
  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  isDelete = true;
  id: number;
  listFilterResult: Voucher[] = [];
  listDelete: number[] = [];
  isSelected = true;

  constructor(private voucherService: VoucherService,
              private modalService: NgbModal,
              private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }


  ngOnInit() {
    this.getAllVoucher();
  }

  getVoucherId(id: number) {
    this.id = id;
  }

  initModal(model: any, type = null): void {
    this.view.view(model, type);
  }

  checkAllCheckBox(ev) {
    this.listVoucher.forEach((x) => (x.checked = ev.target.checked));
    this.changeModel();
  }

  changeModel() {
    const selectedVoucher = [...this.listVoucher]
      .filter((voucher) => voucher.checked)
      .map((p) => p.id);
    if (selectedVoucher.length > 0) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  deleteVoucher() {
    this.voucherService.deleteVoucher(this.id).subscribe(() => {
      this.voucherService.getAllVoucher().subscribe(listVoucher => {
        this.listVoucher = listVoucher;
      });
      $(function() {
        $('#modal-delete').modal('hide');
      });
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'success',
          title: 'Xóa thành công'
        });
      });
    }, () => {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Xóa thất bại'
        });
      });
    });
  }

  getAllVoucher() {
    this.voucherService.getAllVoucher().subscribe(listVoucher => {
      this.listVoucher = listVoucher;
      this.listFilterResult = this.listVoucher;
      $(function() {
        $('#table-category').DataTable({
          'paging': true,
          'lengthChange': true,
          'retrieve': true,
          'searching': true,
          'ordering': false,
          'info': false,
          'autoWidth': true,
        });
      });
    });
  }

  deleteListVoucher() {
    for (var i = 0; i < this.listVoucher.length; i++) {
      if (this.listVoucher[i].checked === true) {
        this.listDelete.push(this.listVoucher[i].id);
      }
    }
    this.voucherService.deleteListVoucher(this.listDelete).subscribe(res => {
        this.getAllVoucher();
        $(function() {
          $('#modal-delete-list').modal('hide');
        });
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Xóa thành công'
          });
        });
        this.listDelete = [];
        this.isDelete = true;
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
            title: 'Xóa thất bại'
          });
        });
      });
    this.getAllVoucher();
  }

  changeStatus(event: any) {
    let list = [];
    // tslint:disable-next-line: radix
    switch (parseInt(event)) {
      case -1:
        this.listVoucher = [...this.listFilterResult];
        break;
      case 1:
        list = [...this.listFilterResult];
        this.listVoucher = list.filter(item => item.status === true);
        break;
      case 0:
        list = [...this.listFilterResult];
        this.listVoucher = list.filter(item => item.status === false);
        break;
      default:
        break;
    }
  }
}
