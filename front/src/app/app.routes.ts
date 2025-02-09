import { Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { PublishComponent } from './publish/publish.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
  {
    path: "browse", component: BrowseComponent
  },
  {
    path: "product/:id", component: ProductDetailsComponent
  },
  {
    path: "publish", component: PublishComponent, canActivate: [authenticatedGuard]
  },
  {
    path: "login", component: LoginComponent
  },
  {
    path: "register", component: RegisterComponent
  }
];
