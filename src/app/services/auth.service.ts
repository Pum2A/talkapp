import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  defaultAvatar = 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png';
  private userData: Observable<firebase.User>;
  private currentUser: UserData;
  private currentUser$ = new BehaviorSubject<UserData>(null);

  constructor(private router: Router, private afs: AngularFirestore, private afAuth: AngularFireAuth) {

    this.userData = afAuth.authState;

    this.userData.subscribe(user => {
      if (user) {
        this.afs.collection<UserData>('users').doc<UserData>(user.uid)
          .valueChanges()
          .subscribe(currentUser => {
            if (currentUser != undefined) {
              this.currentUser = currentUser;
              this.currentUser$.next(this.currentUser);
            } else {
              this.currentUser = null;
              this.currentUser$.next(this.currentUser);
            }
          });
      }
    });

  }

  CurrentUser(): Observable<UserData> {
    return this.currentUser$.asObservable();
  }

  SignUp(email: string, password: string, firstName: string, lastName: string, avatar: string): void {

    if (avatar === undefined || avatar === '') {
      avatar = this.defaultAvatar;
    }

    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        if (res) {
          const user: UserData = {
            id: res.user.uid,
            firstName,
            lastName,
            email,
            avatar,
            addedToFriends: false



          };

          this.afs.collection('users').doc(res.user.uid)
            .set(user)
            .then(() => {
              this.currentUser = user;
              this.currentUser$.next(this.currentUser);
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  }

  get UserData(): Observable<firebase.User> {
    return this.userData;
  }

  signIn(email: string, password: string): void {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.userData = this.afAuth.authState;

        this.afs.collection<UserData>('users')
          .doc<UserData>(res.user.uid)
          .valueChanges()
          .subscribe(user => {
            if (user) {
              this.currentUser = user;
              this.currentUser$.next(this.currentUser);
            }
          });
      })
      .catch(err => console.log(err));
  }

  Logout(): void {
    this.afAuth.signOut().then(res => {
      this.currentUser = null;
      this.currentUser$.next(this.currentUser);
      this.router.navigateByUrl('/login').then();
    });
  }

  searchUserInDatabase(user_id: string): Observable<UserData> {
    return this.afs.collection<UserData>('users').doc<UserData>(user_id).valueChanges();
  }
}

export interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  addedToFriends: boolean;

}
