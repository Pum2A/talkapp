import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AddFriendService {
  constructor(private firestore: AngularFirestore) {}

  addFriend(userId: string, friendName: string, friendEmail: string, friendLastName): Promise<void> {
    const friendData = {
      firstName: friendName,
      lastName: friendLastName,
      email: friendEmail

    };

    const friendRef = this.firestore.collection(`users/${userId}/friends`).doc();
    return friendRef.set(friendData)
      .then(() => {
        console.log('Znajomy został pomyślnie dodany.');
      })
      .catch(error => {
        console.error('Wystąpił błąd podczas dodawania znajomego:', error);
        throw error;
      });
  }


}
