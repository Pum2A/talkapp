import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  isClicked = false;

  isClickedProfile(){

    this.isClicked =! this.isClicked
    console.log('click')
  }
}
