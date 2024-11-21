import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorOrdersListComponent } from './contributor-orders-list.component';

describe('ContributorOrdersListComponent', () => {
  let component: ContributorOrdersListComponent;
  let fixture: ComponentFixture<ContributorOrdersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorOrdersListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContributorOrdersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
