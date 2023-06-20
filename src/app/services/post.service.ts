import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  CurrenUser!: User;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe(user => this.CurrenUser = user);

   }

   getAllPosts(): Observable<any> {
    return this.afs.collection<any>('posts', ref => ref.orderBy('time', 'desc'))
    .snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(item =>{
          return {
            id:item.payload.doc.id,
            ...item.payload.doc.data()
          };
        } );
      })
    )
   }

   postMessage(message: string, ownerName: string, otherItems: any): void {
    this.afs.collection('posts').add({
      message,
      title: ownerName,
      user_id: this.CurrenUser.uid,
      time: firebase.firestore.FieldValue.serverTimestamp(),
      ...otherItems
    }).then(res => console.log(res)).catch( err => console.log(err));
   }

}
