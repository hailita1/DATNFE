import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../service/user/user.service';
import {Router} from '@angular/router';
import {User} from '../../model/user';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.component.html',
  styleUrls: ['./resetpass.component.scss']
})
export class ResetpassComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    fullName: new FormControl(''),
    telephoneNumber: new FormControl(''),
    terms: new FormControl('')
  });
  isSubmitted = false;

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    $(document).ready(function() {
      $('#register').validate({
        rules: {
          email: {
            required: true,
            email: true,
          }
        },
        messages: {
          email: {
            required: 'Nhập địa chỉ email',
            email: 'Không đúng định dạng'
          }
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
          error.addClass('invalid-feedback');
          element.closest('.input-group').append(error);
        },
        highlight: function(element, errorClass, validClass) {
          $(element).addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).removeClass('is-invalid');
        }
      });
    });
  }

  register() {
    this.isSubmitted = true;
    const user: User = {
      email: this.registerForm.value.email
    };
    if (user.email !== '') {
      this.userService.resetpassword(user).subscribe(res => {
        this.router.navigate(['/login']).finally(() => {
        });
        this.registerForm.reset();
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Mật khẩu đã được gửi qua Email của bạn'
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
            title: 'Lấy lại mật khẩu thất bại'
          });
        });
      });
    } else {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Bạn hãy địa chỉ Email'
        });
      });
    }
  }
}
