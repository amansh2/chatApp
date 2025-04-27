import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { SigninComponent } from './components/sign-in/sign-in.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: UserListComponent , canActivate:[authGuard]},
  {path: 'sign-in', component: SigninComponent}
//   { path: 'about', component: AboutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]  // Make RouterModule available for other modules/components
})
export class RouteModule {}
