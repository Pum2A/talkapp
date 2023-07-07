import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchFriendsService {

  constructor(private firestore: AngularFirestore) { }

  searchFriends(firstName: string, lastName: string): Observable<UserData[]> {
    return this.firestore.collection<UserData>('users', ref =>
      ref.where('firstName', '==', firstName)
         .where('lastName', '==', lastName)
    ).valueChanges();
  }
}
