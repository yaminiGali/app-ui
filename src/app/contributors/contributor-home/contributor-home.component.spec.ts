import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorHomeComponent } from './contributor-home.component';

describe('ContributorHomeComponent', () => {
  let component: ContributorHomeComponent;
  let fixture: ComponentFixture<ContributorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributorHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContributorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
