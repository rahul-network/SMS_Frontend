import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgSubmittedComponent } from './ecg-submitted.component';

describe('EcgSubmittedComponent', () => {
  let component: EcgSubmittedComponent;
  let fixture: ComponentFixture<EcgSubmittedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcgSubmittedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgSubmittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
