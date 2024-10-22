import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerFoodComponent } from './customer-food.component';

describe('CustomerFoodComponent', () => {
  let component: CustomerFoodComponent;
  let fixture: ComponentFixture<CustomerFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerFoodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
