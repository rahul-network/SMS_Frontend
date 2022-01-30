import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingSubmittedComponent } from './billing-submitted.component';

describe('BillingSubmittedComponent', () => {
  let component: BillingSubmittedComponent;
  let fixture: ComponentFixture<BillingSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingSubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
