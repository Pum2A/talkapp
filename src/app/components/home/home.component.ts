import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService, UserData } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  isClicked = false;

  message: string;
  posts: { avatar: string, firstName: string, lastName: string, message: string, id: string }[] = [];
  user: UserData;
  subs: Subscription[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private firestore: AngularFirestore,
  ) {}


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
}
