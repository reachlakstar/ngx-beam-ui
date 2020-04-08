import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
} from '@nebular/theme';
import { SharedModule } from '@yeti/shared';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { DashboardLayoutComponent } from './containers/dashboard-layout/dashboard-layout.component';
import { OverviewComponent } from './containers/overview/overview.component';
import { ActionComponent } from './components/action/action.component';
import { ConfigsDialogComponent } from './components/config/config.component';
import {ReactiveFormsModule} from "@angular/forms";
@NgModule({
  imports: [
    SharedModule,

    NbLayoutModule,
    NbSidebarModule,
    NbActionsModule,
    NbSearchModule,
    NbMenuModule,
    NbSelectModule,

    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
      {
        path: '',
        component: DashboardLayoutComponent,
        data: {title: 'Dashboard', depth: 1, roles: []},
        children: [
          {
            path: '',
            component: OverviewComponent,
            data: {title: 'Overview'},
          },
          {
            path: 'accounts',
            loadChildren: () => import('@yeti/accounts').then((module) => module.AccountsModule),
            data: {title: 'Grid', depth: 2, preload: false},
          },
        ],
      },
    ]),
    ReactiveFormsModule,
  ],
  // prettier-ignore
  declarations: [
    DashboardLayoutComponent,
    OverviewComponent,
    ActionComponent,
    ConfigsDialogComponent,
    HeaderComponent,
    FooterComponent
  ]
})
export class DashboardModule {}
