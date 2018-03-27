import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardItemDialogComponent } from './board-item-dialog.component';

describe('BoardItemDialogComponent', () => {
  let component: BoardItemDialogComponent;
  let fixture: ComponentFixture<BoardItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
