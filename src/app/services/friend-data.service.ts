import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserData } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class FriendDataService {
  private friendData: any;

  constructor(private firestore: AngularFirestore) {}


  setFriendData(data: any) {
    this.friendData = data;
  }

  getFriendData() {
    return this.friendData;
  }


  getFriends(userId: string): Observable<any[]> {
    console.log('getFriends - userId:', userId);

    return this.firestore
      .collection(`users/${userId}/friends`)
      .valueChanges();
  }


}

export interface FriendData {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  addedToFriends: boolean;
  // inne właściwości związane z przyjacielem
}
