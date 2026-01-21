import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkersList } from './workers-list';

describe('WorkersList', () => {
  let component: WorkersList;
  let fixture: ComponentFixture<WorkersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
