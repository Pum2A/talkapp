import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendDataService {
  private friendData: any;

  setFriendData(data: any) {
    this.friendData = data;
  }

  getFriendData() {
    return this.friendData;
  }
}
