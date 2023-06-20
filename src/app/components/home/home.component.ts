import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserData } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isClicked = false;

  message: any;
  posts: { avatar: string, firstName: string, lastName: string, message: string }[] = [];
  user: UserData;
  subs: Subscription[] = [];

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

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
    this.subs.map((s) => s.unsubscribe());
  }
  isClickedProfile() {
    this.isClicked = !this.isClicked;
    console.log('click');
  }

  postMessage(form: NgForm) {
    const {message} = form.value;

    this.postService.postMessage(message, `${this.user.firstName} ${this.user.lastName}`,
    {
      avatar: this.user.avatar,
      lastName: this.user.lastName,
      firstName: this.user.firstName,
    }


    );


    form.resetForm();
  }

}
