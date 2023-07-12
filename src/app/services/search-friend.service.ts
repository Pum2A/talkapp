import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    ).snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as UserData;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
}
