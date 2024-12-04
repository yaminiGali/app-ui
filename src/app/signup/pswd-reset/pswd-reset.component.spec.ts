import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PswdResetComponent } from './pswd-reset.component';

describe('PswdResetComponent', () => {
  let component: PswdResetComponent;
  let fixture: ComponentFixture<PswdResetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PswdResetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PswdResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
