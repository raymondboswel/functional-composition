import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdeToJoyScoreComponent } from './ode-to-joy-score.component';

describe('OdeToJoyScoreComponent', () => {
  let component: OdeToJoyScoreComponent;
  let fixture: ComponentFixture<OdeToJoyScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdeToJoyScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdeToJoyScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
