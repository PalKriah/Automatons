import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushdownAutomatonComponent } from './pushdown-automaton.component';

describe('PushdownAutomatonComponent', () => {
  let component: PushdownAutomatonComponent;
  let fixture: ComponentFixture<PushdownAutomatonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PushdownAutomatonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PushdownAutomatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
