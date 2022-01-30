import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTimelogComponent } from './billing-timelog.component';

describe('BillingTimelogComponent', () => {
  let component: BillingTimelogComponent;
  let fixture: ComponentFixture<BillingTimelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingTimelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTimelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
