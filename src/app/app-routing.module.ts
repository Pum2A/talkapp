import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { TalkappGuard } from './guards/talkapp.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { FriendListComponent } from './components/friend-list/friend-list.component';
import { MessagesComponent } from './components/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [TalkappGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'friends',
    component: FriendListComponent,
  },
  {
    path: 'messages',
    component: MessagesComponent,
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
