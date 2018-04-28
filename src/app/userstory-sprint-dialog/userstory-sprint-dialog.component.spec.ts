import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserstorySprintDialogComponent } from './userstory-sprint-dialog.component';

describe('UserstorySprintDialogComponent', () => {
  let component: UserstorySprintDialogComponent;
  let fixture: ComponentFixture<UserstorySprintDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserstorySprintDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserstorySprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
