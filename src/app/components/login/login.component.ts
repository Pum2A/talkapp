import { Component, Inject, OnInit, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  subs: Subscription[ ] = [];
  constructor(private matDialog:MatDialog , private router: Router ,private afAuth: AngularFireAuth , private authService: AuthService , private snackbar: MatSnackBar) {}
  loginForm: any = {
    email: '',
    username: '',
    password: ''
  };


  ngOnInit(): void {
    this.subs.push(
      this.authService.UserData.subscribe(user => {
        if (user) {
          this.router.navigateByUrl('/').then();
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.map(s => s.unsubscribe());
  }



  loginn(form: NgForm): void {
    const  {email, password} = form.value;

    if (!form.valid){
      return;
    }


    this.authService.signIn(email, password);
    form.resetForm();
  }

  openRegister(): void{
    const dialogRef = this.matDialog.open(RegisterComponent, {
      role: 'dialog',
      height: '480px',
      width: '480px',
    });

    dialogRef.afterClosed().subscribe(result => {
      const  {fname, lname, email, password, avatar} = result;
      console.log(result);
      if (result =! undefined) {
        this.authService.SignUp(email, password, fname, lname, avatar);
      }
    });

    return;
  }

}
