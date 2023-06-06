import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private router: Router) {}
  loginForm: any = {
    username: '',
    password: ''
  };


  login() {
    const storedUserDataString = localStorage.getItem('userData');
    if (storedUserDataString !== null) {
      const storedUserData = JSON.parse(storedUserDataString);
      const enteredUsername = this.loginForm.username;
      const enteredPassword = this.loginForm.password;
      if (enteredUsername === storedUserData.username && enteredPassword === storedUserData.password) {
        console.log('Zalogowano pomyślnie!');
        this.router.navigate(['home']); // Przekierowanie na stronę główną
      } else {
        console.log('Nieprawidłowe dane logowania!');
        // Komunikat o błędzie logowania
      }
    }
  }
}
