import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MctMainComponent } from './mct-main.component';

describe('MctMainComponent', () => {
  let component: MctMainComponent;
  let fixture: ComponentFixture<MctMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MctMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MctMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
