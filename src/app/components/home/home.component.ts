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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
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
    private postService: PostService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private friendDataService: FriendDataService,
    private addFriendService: AddFriendService,
    private searchFriendsService: SearchFriendsService,

  ) {}

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

  logout() {
    this.authService.Logout();
  }

  ngOnInit(): void {
    this.subs.push(
      this.postService.getAllPosts().subscribe((posts) => {
        this.posts = posts;
      })
    );

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

  isClickedProfile() {
    this.isClicked = !this.isClicked;
    console.log('click');
  }

  postMessage(form: NgForm) {
    if (this.user) {
      const { message } = form.value;
      this.postService.postMessage(message, `${this.user.firstName} ${this.user.lastName}`, {
        avatar: this.user.avatar,
        lastName: this.user.lastName,
        firstName: this.user.firstName,
        user_id: this.user.id,
      });
      form.resetForm();
    } else {
      console.error('Użytkownik nie jest zalogowany!');
    }
  }

  deletePost(postId: string) {
    // Uzyskanie referencji do konkretnego dokumentu na podstawie identyfikatora posta
    const postDoc = this.firestore.collection('posts').doc(postId);

    // Sprawdzenie, czy post należy do zalogowanego użytkownika
    if (this.user && this.user.id) {
      const user_id = this.user.id;

      // Usunięcie dokumentu tylko jeśli user_id posta odpowiada zalogowanemu użytkownikowi
      postDoc.ref.get().then((docSnapshot) => {
        const postData = docSnapshot.data() as { user_id: string }; // Asercja typów
        if (postData && postData.user_id === user_id) {
          postDoc
            .delete()
            .then(() => {
              console.log('Post został pomyślnie usunięty!');
            })
            .catch((error) => {
              console.error('Wystąpił błąd podczas usuwania posta:', error);
            });
        } else {
          console.error('Nie masz uprawnień do usunięcia tego posta!');
        }
      });
    } else {
      console.error('Użytkownik nie jest zalogowany!');
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
}
