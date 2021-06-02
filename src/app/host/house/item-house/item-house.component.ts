import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {Category} from '../../../model/category';
import {Utilitie} from '../../../model/utilitie';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HouseService} from '../../../service/house/house.service';
import {CategoryService} from '../../../service/category/category.service';
import {UtilitieService} from '../../../service/utilitie/utilitie.service';
import * as firebase from 'firebase';
import {House} from '../../../model/house';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UserToken} from '../../../model/user-token';

declare const myTest: any;
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-item-house',
  templateUrl: './item-house.component.html',
  styleUrls: ['./item-house.component.scss']
})
export class ItemHouseComponent implements OnInit {
  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listHouse: Array<any>;
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
  listCategory: Category[];
  listUtilitie: Utilitie[];
  listUtilitieAddToHouse: any[] = [];
  myItems: File[] = [];
  arrayPicture: any[] = [];
  urlPicture: any[] = [];
  isLoading = false;
  idUser: any;
  page = 1;
  pageSize = 2;
  pageImage = 1;
  pageSizeImage = 4;
  model: any;
  submitted = false;
  arrCheck = [];
  formGroup: FormGroup;
  formName = 'HomeStay';
  imageObject: Array<object> = [];

  currentUser: UserToken;
  hasRoleUser = false;
  hasRoleAdmin = false;
  grid: any = {
    rowData: []
  };

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private  houseService: HouseService,
              private categoryService: CategoryService,
              private  utilitieService: UtilitieService,
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
        this.title = `Chỉnh sửa thông tin ${this.formName}`;
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
    this.getAllCategory();
    this.getAllUtilitie();
    this.idUser = JSON.parse(localStorage.getItem('user') || '{id}').id;
  }

  view(model: any, type = null): void {
    console.log(model);
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.formGroup = this.fb.group({
        name: [{value: null, disabled: this.isInfo}, [Validators.required]],
        address: [{value: null, disabled: this.isInfo}, [Validators.required]],
        description: [{value: null, disabled: this.isInfo}, [Validators.required]],
        numberRoom: [{value: null, disabled: this.isInfo}, [Validators.required]],
        price: [{value: null, disabled: this.isInfo}, [Validators.required]],
        category: [{value: null, disabled: this.isInfo}, [Validators.required]],
        utilitie: [{value: null, disabled: this.isInfo}, [Validators.required]],
        discount: [{value: null, disabled: this.isInfo}, [Validators.required]],
        acreage: [{value: null, disabled: this.isInfo}, [Validators.required]],
        status: [{value: false, disabled: true}],
      });
    } else {
      this.listUtilitieAddToHouse = this.model.utilitie;
      this.grid.rowData = this.model.services;
      this.urlPicture = this.model.images;
      this.listUtilitieAddToHouse = this.model.utilitie;
      for (var i = 0; i < this.urlPicture.length; i++) {
        this.imageObject[i] = {
          image: this.urlPicture[i].link,
          thumbImage: this.urlPicture[i].link
        };
      }
      this.formGroup = this.fb.group({
        name: [{value: this.model.name, disabled: this.isInfo}, [Validators.required]],
        address: [{value: this.model.address, disabled: this.isInfo}, [Validators.required]],
        description: [{value: this.model.description, disabled: this.isInfo}, [Validators.required]],
        numberRoom: [{value: this.model.numberRoom, disabled: this.isInfo}, [Validators.required]],
        price: [{value: this.model.price, disabled: this.isInfo}, [Validators.required]],
        discount: [{value: this.model.discount, disabled: this.isInfo}, [Validators.required]],
        category: [{value: this.model.category.id, disabled: this.isInfo}, [Validators.required]],
        utilitie: [{value: this.model.utilitie, disabled: this.isInfo}, [Validators.required]],
        acreage: [{value: this.model.acreage, disabled: this.isInfo}, [Validators.required]],
        status: [{value: this.model.status, disabled: true}]
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'xl',
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
    let house: any;
    this.submitted = true;
    if (this.formGroup.invalid && this.validCategoryMeta() === false) {
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
    console.log(this.grid.rowData);
    if (this.isEdit) {
      house = {
        name: this.formGroup.get('name').value,
        address: this.formGroup.get('address').value,
        description: this.formGroup.get('description').value,
        acreage: this.formGroup.get('acreage').value,
        numberRoom: this.formGroup.get('numberRoom').value,
        discount: this.formGroup.get('discount').value,
        status: this.formGroup.get('status').value,
        price: this.formGroup.get('price').value,
        category: {
          id: this.formGroup.get('category').value
        },
        utilitie: this.listUtilitieAddToHouse,
        user: {
          id: this.idUser
        },
        id: this.model.id,
        images: this.urlPicture,
        services: this.grid.rowData
      };
    } else {
      house = {
        name: this.formGroup.get('name').value,
        address: this.formGroup.get('address').value,
        description: this.formGroup.get('description').value,
        acreage: this.formGroup.get('acreage').value,
        numberRoom: this.formGroup.get('numberRoom').value,
        discount: this.formGroup.get('discount').value,
        status: this.formGroup.get('status').value,
        price: this.formGroup.get('price').value,
        numberHires: 0,
        category: {
          id: this.formGroup.get('category').value
        },
        utilitie: this.listUtilitieAddToHouse,
        user: {
          id: this.idUser
        },
        images: this.urlPicture,
        services: this.grid.rowData
      };
    }
    if (this.isAdd) {
      this.houseService.createHouse(house).subscribe(res => {
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
          // this.grid.rowData = [];
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
      this.houseService.updateHouse(house.id, house).subscribe(res => {
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
          this.imageObject = [];
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
      this.listUtilitieAddToHouse = [];
      this.urlPicture = [];
      return 'by clicking on a backdrop';
    } else {
      this.listUtilitieAddToHouse = [];
      this.urlPicture = [];
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit('success');
  }

  getAllCategory() {
    this.categoryService.getAllCategoryStatusTrue().subscribe(listCategory => {
      this.listCategory = listCategory;
    });
  }


  getAllUtilitie() {
    this.utilitieService.getAllUtilitieStatusTrue().subscribe(listUtilitie => {
      this.listUtilitie = listUtilitie;
    });
  }

  addUtilitieToHouse(id) {
    const utilitie1 = this.listUtilitie
      .filter((utilitie) => utilitie.id == id);

    const utilitie2 = this.listUtilitieAddToHouse
      .filter((utilitie) => utilitie1[0].id == utilitie.id);
    if (utilitie2.length == 0) {
      this.listUtilitieAddToHouse.push(utilitie1[0]);
    }
  }

  delete(id) {
    const indexOf = this.listUtilitieAddToHouse.indexOf(id);
    this.listUtilitieAddToHouse.splice(indexOf, 1);
  }

  // Upload avt
  uploadFile(event) {
    this.myItems = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.myItems.push(files[i]);
    }
    this.uploadAll(this.myItems);
  }

  uploadAll(imge) {
    this.isLoading = true;
    Promise.all(
      imge.map(file => this.putStorageItem(file))
    )
      .then((url) => {
        this.arrayPicture = url;
        for (var i = 0; i < this.arrayPicture.length; i++) {
          this.urlPicture.push(this.arrayPicture[i]);
          this.imageObject[i] = {
            image: this.arrayPicture[i].link,
            thumbImage: this.arrayPicture[i].link
          };
        }
        this.isLoading = false;
      })
      .catch((error) => {
        this.isLoading = false;
      });
  }

  putStorageItem(file): Promise<House> {
    // the return value will be a Promise
    const metadata = {
      contentType: 'image/jpeg',
    };
    return new Promise<House>((resolve, reject) => {
      firebase.storage().ref('img/' + Date.now()).put(file, metadata)
        .then(snapshot => {
          snapshot.ref.getDownloadURL().then(downloadURL => {
            const link = {link: downloadURL};
            // @ts-ignore
            resolve(link);
          });
        })
        .catch(error => reject(error));
    });
  }

  pushDeleteImage(i) {
    const indexOf = this.urlPicture.indexOf(i);
    this.urlPicture.splice(indexOf, 1);
  }

  onClick() {
    myTest();
  }

  addMeta(event: any) {
    const model = {
      name: '',
      price: '',
      status: true,
      validName: false,
      validPrice: false,
    };
    this.grid.rowData.push(model);
  }

  btnDeleteClickedHandler(event: any) {
    const indexOfItem = this.grid.rowData.indexOf(event);
    this.grid.rowData.splice(indexOfItem, 1);
  }

  validCategoryMeta() {
    let flag = false;
    this.grid.rowData.forEach((item) => {
      if (item.name === '' || item.name === null || item.name === undefined) {
        item.validName = true;
        flag = true;
      } else {
        item.validName = false;
        flag = false;
      }

      if (item.price === '' || item.price === null || item.price === undefined) {
        item.validPrice = true;
        flag = true;
      } else {
        item.validPrice = false;
        flag = false;
      }
    });
    if (flag === false) {
      return true;
    }
    return false;
  }
}
