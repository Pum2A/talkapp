import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

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

      if (
        enteredUsername === storedUserData.username &&
        enteredPassword === storedUserData.password
      ) {
        console.log('Zalogowano pomyślnie!');
        // operacje po zalogowaniu, np. przekierować użytkownika na inną stronę.
      } else {
        console.log('Nieprawidłowe dane logowania!');
        // komunikat o błędzie logowania.
      }
    } else {
      console.log('Brak danych użytkownika w LocalStorage!');
      // komunikat o braku zarejestrowanych użytkowników.
    }
  }
}
