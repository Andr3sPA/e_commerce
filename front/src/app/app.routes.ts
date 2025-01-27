import { Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { PublishComponent } from './publish/publish.component';

export const routes: Routes = [
  {
    path: "browse", component: BrowseComponent
  },
  {
    path: "publish", component: PublishComponent
  }
];
