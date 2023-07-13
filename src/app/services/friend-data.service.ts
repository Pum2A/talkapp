import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { UserData } from './auth.service';
import { map } from 'rxjs';

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

  getFriends(userId: string): Observable<FriendData[]> {
    return this.firestore
      .collection<FriendData>(`users/${userId}/friends`)
      .snapshotChanges()
      .pipe(
        map((snaps) =>
          snaps.map((snap) => {
            const id = snap.payload.doc.id;
            const data = snap.payload.doc.data() as FriendData;
            return { id, ...data };
          })
        )
      );
  }


  removeFriend(userId: string, friendId: string): Promise<void> {
    const friendRef = this.firestore.collection(`users/${userId}/friends`).doc(friendId);
    return friendRef.delete();
  }

}

export interface FriendData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  addedToFriends: boolean;
  // inne właściwości związane z przyjacielem
}
