import { Component } from '@angular/core';
import { SearchFriendsService } from 'src/app/services/search-friend.service';
import { UserData } from 'src/app/services/auth.service';

@Component({
  selector: 'app-search-friend',
  templateUrl: './search-friend.component.html',
})
export class SearchFriendComponent {
  firstName: string;
  lastName: string;
  searchResults: UserData[];

  constructor(private searchFriendsService: SearchFriendsService) {}

  searchFriends() {
    if (this.firstName && this.lastName) {
      this.searchFriendsService.searchFriends(this.firstName, this.lastName)
        .subscribe(results => {
          this.searchResults = results;
        });
    }
  }
}
