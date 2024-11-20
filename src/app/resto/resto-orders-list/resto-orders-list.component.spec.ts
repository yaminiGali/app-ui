import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoOrdersListComponent } from './resto-orders-list.component';

describe('RestoOrdersListComponent', () => {
  let component: RestoOrdersListComponent;
  let fixture: ComponentFixture<RestoOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestoOrdersListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestoOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
