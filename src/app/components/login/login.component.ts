import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router, private snackbar: MatSnackBar) {}
  loginForm: any = {
    email: '',
    username: '',
    password: ''
  };

  login() {

    const successSnackbarConfig: MatSnackBarConfig = {
      panelClass: ['success-snackbar']
    };

    const errorSnackbarConfig: MatSnackBarConfig = {
      panelClass: ['error-snackbar'],

    };


    const storedUserDataString = localStorage.getItem('userData');
    if (storedUserDataString !== null) {
      const storedUserData = JSON.parse(storedUserDataString);
      const enteredUsername = this.loginForm.username;
      const enteredEmail = this.loginForm.email;
      const enteredPassword = this.loginForm.password;
      if (enteredUsername === storedUserData.username && enteredPassword === storedUserData.password && enteredEmail === storedUserData.email) {
        this.snackbar.open('Rejestracja zakończona pomyślnie!', 'Zamknij', {
          duration:2000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['home']); // Przekierowanie na stronę główną
      } else {
        this.snackbar.open('Logowanie zakończone niepomyślnie!', 'Zamknij', {
          duration:2000,
          panelClass: ['error-snackbar']
        });
        // Komunikat o błędzie logowania
      }
    }
  }
}
