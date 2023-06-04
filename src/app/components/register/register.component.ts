import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    email: ['', [Validators.required, Validators.email]],
  });

  isSubmitted = false;

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    console.log(
      'submitted form',
      this.registerForm.value,
      this.registerForm.invalid
    );
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const userData = {
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
        email: this.registerForm.value.email,
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      const storedUserData = localStorage.getItem('userData');
      if (storedUserData !== null) {
        const userData = JSON.parse(storedUserData);
        console.log(userData.username);
        console.log(userData.password);
        console.log(userData.email);
      } else {
        console.log('Brak danych użytkownika w LocalStorage.');
      }
    }
  }
}
