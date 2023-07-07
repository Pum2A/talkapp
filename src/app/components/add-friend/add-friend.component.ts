import { Component } from '@angular/core';
import { AddFriendService } from 'src/app/services/add-friend.service';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { FriendDataService } from 'src/app/services/friend-data.service';

@Component({
  selector: 'app-add-friend',
  templateUrl: './add-friend.component.html',
  // styleUrls: ['./add-friend.component.css']
})
export class AddFriendComponent {
  friendData = { name: '', lastName: '', email: '' };

  constructor(
    private addFriendService: AddFriendService,
    private authService: AuthService,
    private friendDataService: FriendDataService
  ) {}



  addFriend() {
    this.authService.CurrentUser()
      .subscribe((user: UserData) => {
        if (user) {
          const userId = user.id;
          const friendName = this.friendData.name;
          const friendLastName = this.friendData.lastName;
          const friendEmail = this.friendData.email;

          this.addFriendService.addFriend(userId, friendName, friendEmail, friendLastName,)
            .then(() => {
              console.log('Znajomy został pomyślnie dodany.');
              // Tutaj możesz wykonać inne działania po dodaniu znajomego, np. wyświetlić komunikat dla użytkownika
            })
            .catch(error => {
              console.error('Wystąpił błąd podczas dodawania znajomego:', error);
              // Tutaj możesz obsłużyć błąd, np. wyświetlić komunikat dla użytkownika informujący o niepowodzeniu
            });
        } else {
          console.error('Użytkownik nie jest zalogowany!');
        }
      });
  }


}
