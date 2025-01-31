import { Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { PublishComponent } from './publish/publish.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  {
    path: "browse", component: BrowseComponent
  },
  {
    path: "publish", component: PublishComponent
  },
  {
    path: "login", component: LoginComponent
  },
  {
    path: "register", component: RegisterComponent
  }
];
