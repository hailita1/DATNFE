import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../../service/category/category.service';
import {House} from '../../../model/house';
import {Bill} from '../../../model/bill';
import {BillService} from '../../../service/bill/bill.service';
import {HouseService} from '../../../service/house/house.service';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UserToken} from '../../../model/user-token';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-quickview',
  templateUrl: './quickview.component.html',
  styleUrls: ['./quickview.component.scss']
})
export class QuickviewComponent implements OnInit {
  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  closeResult: string;
  modalReference!: any;
  currentHouse: House;
  listReview: Bill[] = [];
  listReview1: Bill[] = [];
  starAverage: number = 0;
  currentUser: UserToken;
  id: any;
  imageObject: Array<object> = [];

  constructor(private modalService: NgbModal,
              private  billService: BillService,
              private authenticationService: AuthenticationService,
              private houseService: HouseService) {
    this.authenticationService.currentUser.subscribe(value => {
      this.currentUser = value;
    });
  }

  ngOnInit(): void {
  }

  view(model: any): void {
    this.open(this.childModal);
    this.currentHouse = model;
    this.getAllReview(model.id);
    this.id = model.id;
    for (var i = 0; i < this.currentHouse.images.length; i++) {
      this.imageObject[i] = {
        image: this.currentHouse.images[i].link,
        thumbImage: this.currentHouse.images[i].link
      };
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getAllReview(id) {
    this.listReview = [];
    const bill = {
      id: this.currentHouse.id
    };
    this.billService.getAllBillByHouse(bill).subscribe(listReview => {
      this.listReview1 = listReview;
      let sum = 0;
      this.listReview1.map(review => {
        if (review.evaluate != null && review.comment != null) {
          this.listReview.push(review);
        }
      });
      this.listReview.map(review => {
        const evaluate = Number(review.evaluate);
        sum += evaluate;
      });
      this.starAverage = sum / this.listReview.length;
    });
  }

  createMessage() {
    this.houseService.changeMessage(this.id);
  }
}
