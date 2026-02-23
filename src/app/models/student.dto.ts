import { Student } from "../services/student-service";

export class CreateStudentDto {
  constructor(
    public firstName: string,
    public lastName: string,
    public age: number,
    public email: string,
    public course: string,
    public year: number,
    public rollNumber: string,
    public enrollmentDate: string
  ) {}

  static fromStudent(student: Student, sanitizeFn: (val: string) => string): CreateStudentDto {
    return {
      firstName: sanitizeFn(student.firstName),
      lastName: sanitizeFn(student.lastName),
      age: student.age,
      email: sanitizeFn(student.email),
      course: sanitizeFn(student.course),
      year: student.year,
      rollNumber: sanitizeFn(student.rollNumber),
      enrollmentDate: new Date(student.enrollmentDate).toISOString().split('T')[0]
    };
  }
}