import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudents } from './add-students';

describe('AddStudents', () => {
  let component: AddStudents;
  let fixture: ComponentFixture<AddStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStudents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
