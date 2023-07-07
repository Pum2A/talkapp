import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FriendDataService } from 'src/app/services/friend-data.service';
import { AddFriendComponent } from '../add-friend/add-friend.component';
import { AddFriendService } from 'src/app/services/add-friend.service';
import { SearchFriendsService } from 'src/app/services/search-friend.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  isClicked = false;
  deafultAvatar = 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'
  message: string;
  posts: { avatar: string, firstName: string, lastName: string, message: string, id: string }[] = [];
  user: UserData;
  subs: Subscription[] = [];
  friendData: { name: string, email: string, lastName: string } = { name: '', email: '', lastName: '' };
  searchQuery: string;
  searchResults: UserData[] = [];
  searchResultsFound = false;
  searchFormSubmitted = false;




  firstName: string;
  lastName: string;




  constructor(
    private postService: PostService,
    private authService: AuthService,
    private firestore: AngularFirestore,
    private friendDataService: FriendDataService,
    private addFriendService: AddFriendService,
    private searchFriendsService: SearchFriendsService,
  ) {}










  addFriend(friend: UserData) {
    if (friend && friend.id) {
      const userId = ''; // Zastąp to odpowiednim id użytkownika
      const friendId = friend.id;

      this.addFriendService.addFriend(userId, friendId, this.lastName, this.firstName)
        .then(() => {
          console.log('Znajomy został pomyślnie dodany.');
          // Tutaj możesz wykonać inne działania po dodaniu znajomego, np. wyświetlić komunikat dla użytkownika
        })
        .catch(error => {
          console.error('Wystąpił błąd podczas dodawania znajomego:', error);
          // Tutaj możesz obsłużyć błąd, np. wyświetlić komunikat dla użytkownika informujący o niepowodzeniu
        });
    }
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
      this.authService.CurrentUser().subscribe(user => {
        this.user = user;
      })
    );

    this.friendData = this.friendDataService.getFriendData();



  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  isClickedProfile() {
    this.isClicked = !this.isClicked;
    console.log('click');
  }

  postMessage(form: NgForm) {
    if (this.user) {
      const { message } = form.value;
      this.postService.postMessage(
        message,
        `${this.user.firstName} ${this.user.lastName}`,
        {
          avatar: this.user.avatar,
          lastName: this.user.lastName,
          firstName: this.user.firstName,
          user_id: this.user.id
        }
      );
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
          postDoc.delete()
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

      this.searchFriendsService.searchFriends(firstName, lastName)
        .subscribe(results => {
          this.searchResults = results;
          this.searchResultsFound = this.searchResults.length > 0;
        });

      this.searchFormSubmitted = true; // Ustawienie flagi wysłania formularza
    }
  }



}



