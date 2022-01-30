import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcgReportsComponent } from './ecg-reports.component';

describe('EcgReportsComponent', () => {
  let component: EcgReportsComponent;
  let fixture: ComponentFixture<EcgReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcgReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcgReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
