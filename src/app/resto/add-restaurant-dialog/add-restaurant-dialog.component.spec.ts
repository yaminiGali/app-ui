import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRestaurantDialogComponent } from './add-restaurant-dialog.component';

describe('AddRestaurantDialogComponent', () => {
  let component: AddRestaurantDialogComponent;
  let fixture: ComponentFixture<AddRestaurantDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRestaurantDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
