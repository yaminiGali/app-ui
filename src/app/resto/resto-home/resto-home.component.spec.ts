import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoHomeComponent } from './resto-home.component';

describe('RestoHomeComponent', () => {
  let component: RestoHomeComponent;
  let fixture: ComponentFixture<RestoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestoHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
