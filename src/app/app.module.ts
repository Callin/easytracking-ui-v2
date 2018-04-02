import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {SignupComponent} from './auth/signup/signup.component';
import {SiginComponent} from './auth/sigin/sigin.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import {CdkTableModule} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { ProjectBoardComponent } from './project-board/project-board.component';
import {ProjectService} from './service/project-service';
import {HttpClientModule} from '@angular/common/http';
import { BoardItemDialogComponent } from './board-item-dialog/board-item-dialog.component';
import {UserService} from './service/user-service';
import {TaskService} from './service/task-service';
import {BugService} from './service/bug-service';
import {UserStoryService} from './service/user-story-service';
import {SprintService} from './service/sprint-service';
import { OrganizationBoardComponent } from './organization-board/organization-board.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { RemoveItemDialogComponent } from './remove-item-dialog/remove-item-dialog.component';

const appRoutes: Routes = [
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SiginComponent},
  {path: 'organization', component: OrganizationBoardComponent},
  {path: 'project/:id', component: ProjectBoardComponent},
  {path: '', component: UserDashboardComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SiginComponent,
    UserDashboardComponent,
    ProjectDialogComponent,
    ProjectBoardComponent,
    BoardItemDialogComponent,
    OrganizationBoardComponent,
    UserDialogComponent,
    RemoveItemDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatCardModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatGridListModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule
  ],
  entryComponents: [
    SignupComponent,
    SiginComponent,
    ProjectDialogComponent,
    UserDialogComponent,
    RemoveItemDialogComponent,
    BoardItemDialogComponent,
    OrganizationBoardComponent],
  providers: [
    ProjectService,
    UserService,
    UserStoryService,
    BugService,
    TaskService,
    SprintService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
