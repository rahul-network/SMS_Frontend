import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCptcodesComponent } from './billing-cptcodes.component';

describe('BillingCptcodesComponent', () => {
  let component: BillingCptcodesComponent;
  let fixture: ComponentFixture<BillingCptcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCptcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCptcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
