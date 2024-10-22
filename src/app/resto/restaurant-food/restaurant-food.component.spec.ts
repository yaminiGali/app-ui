import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantFoodComponent } from './restaurant-food.component';

describe('RestaurantFoodComponent', () => {
  let component: RestaurantFoodComponent;
  let fixture: ComponentFixture<RestaurantFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
