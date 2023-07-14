import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FriendData, FriendDataService } from 'src/app/services/friend-data.service';
import { AddFriendService } from 'src/app/services/add-friend.service';

import { SearchFriendsService } from 'src/app/services/search-friend.service';


@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.scss']
})
export class FriendListComponent  implements OnInit, OnDestroy {

  isClicked = false;
  defaultAvatar = 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png';
  message: string;
  posts: { avatar: string; firstName: string; lastName: string; message: string; id: string }[] = [];
  user: UserData;
  subs: Subscription[] = [];
  friendData: { name: string; lastName: string } = { name: '', lastName: '' };
  // friends = 10;
  friends: FriendData[] = [];
  friendsSubscription: Subscription;
  searchQuery: string;
  searchResults: UserData[] = [];
  searchResultsFound = false;
  searchFormSubmitted = false;


constructor(
    private authService: AuthService,
    private firestore: AngularFirestore,
    private friendDataService: FriendDataService,
    private addFriendService: AddFriendService,
    private searchFriendsService: SearchFriendsService,
){}


  loadFriends(): void {
    if (this.user && this.user.id) {
      this.friendsSubscription = this.friendDataService
        .getFriends(this.user.id)
        .subscribe((friends: FriendData[]) => {
          this.friends = friends;
          console.log('Number of friends:', this.friends.length);
        });
    }
  }


  removeFriend(friend: FriendData): void {
    if (!this.user || !this.user.id) {
      console.error('User is not logged in!');
      return;
    }

    const userId = this.user.id; // The ID of the user whose friend list to update
    const friendId = this.findFriendId(friend.firstName, friend.lastName); // Find the ID of the friend using firstName and lastName

    if (!friendId) {
      console.error('Friend ID not found!');
      return;
    }

    this.friendDataService.removeFriend(userId, friendId)
      .then(() => {
        console.log('Friend successfully removed.');
        // Perform any additional actions or update the UI
      })
      .catch((error) => {
        console.error('Error removing friend:', error);
      });
  }



  findFriendId(firstName: string, lastName: string): string | null {
    const friend = this.friends.find(f => f.firstName === firstName && f.lastName === lastName);
    return friend ? friend.id : null;
  }

  ngOnInit(): void {

    this.subs.push(
      this.authService.CurrentUser().subscribe((user) => {
        this.user = user;
        this.loadFriends(); // Call a method to load friends or perform other actions dependent on the user data
      })
    );

    if (this.user && this.user.id) {
      this.friendsSubscription = this.friendDataService
        .getFriends(this.user.id)

        .subscribe((friends: FriendData[]) => {
          this.friends = friends;
          console.log('Number of friends:', this.friends.length);

        });
    }



          this.friendData = this.friendDataService.getFriendData();



          this.friendData = { name: '', lastName: '' };

  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());


  if (this.friendsSubscription) {
    this.friendsSubscription.unsubscribe();
  }
  }


  searchFriends(form: NgForm) {
    if (form.valid) {
      const firstName = form.value.firstName;
      const lastName = form.value.lastName;

      this.searchFriendsService.searchFriends(firstName, lastName).subscribe((results) => {
        this.searchResults = results;
        this.searchResultsFound = this.searchResults.length > 0;

      });

      this.searchFormSubmitted = true; // Ustawienie flagi wysłania formularza
    }
  }

  addFriend(result: UserData) {
    if (this.friendData.name && this.friendData.lastName) {
      const userId = this.user.id;
      const friendName = this.friendData.name;
      const friendLastName = this.friendData.lastName;

      const isFriendExist = this.friends.some(
        (friend) => friend.firstName === friendName && friend.lastName === friendLastName
      );

      if (isFriendExist) {
        console.log('This person is already your friend.');
        return;
      }

      const friendData: FriendData = {
        id: result.id,
        firstName: friendName,
        lastName: friendLastName,
        email: result.email,
        avatar: result.avatar,
        addedToFriends: true
      };

      this.addFriendService
        .addFriend(userId, friendName, friendLastName)
        .then(() => {
          console.log('Friend successfully added.');
          // Perform any additional actions after adding a friend
        })
        .catch((error) => {
          console.error('Error adding friend:', error);
          // Handle the error, display an error message, etc.
        });
    } else {
      console.error('Missing friend data!');
    }
  }


}
