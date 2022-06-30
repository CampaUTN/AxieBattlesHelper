import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsPage } from '../instructions/instructions.page';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'init',
    component: InstructionsPage,
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'main',
        loadChildren: () => import('../main/main.module').then(m => m.MainPageModule)
      },
      {
        path: 'logs',
        loadChildren: () => import('../logs/log.module').then(m => m.LogPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/main',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/main',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
