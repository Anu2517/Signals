import { Component, computed, inject } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { WorkerService } from '../../services/worker-service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  imports: [ChartModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  currentYear = new Date().getFullYear();

  //Students 
  private studentService = inject(StudentService);

  totalStudents = computed(() =>
    this.studentService.students().length
  );

  activeStudents = computed(() =>
    this.studentService.students().filter(s => s.status === 'Active').length
  );

  inactiveStudents = computed(() =>
    this.studentService.students().filter(s => s.status === 'Inactive').length
  );

  graduatedStudents = computed(() =>
    this.studentService.students().filter(s => s.status === 'Graduated').length
  );

  // Calculating the growth percentage of students 

  studentGrowthPercent = computed(() => {
    const students = this.studentService.students();

    if (students.length === 0) return 0;
    const years = students.map(s => new Date(s.enrollmentDate).getFullYear());
    const latestYear = Math.max(...years);
    const previousYear = latestYear - 1;

    const current = students.filter(s =>
      new Date(s.enrollmentDate).getFullYear() === latestYear
    ).length;

    const previous = students.filter(s =>
      new Date(s.enrollmentDate).getFullYear() === previousYear
    ).length;

    if (previous === 0) return 0;
    const growth = ((current - previous) / previous) * 100;
    return Math.round(growth);
  });




  //Teachers

  private teacherService = inject(TeacherService);

  totalTeachers = computed(() =>
    this.teacherService.teachers().length
  );

  totalDepartments = computed(() =>
    new Set(this.teacherService.teachers().map(t => t.department)).size
  );

  //Calculating the growth percentage of teachers

  teacherSharePercent = computed(() => {
    const staff = this.totalStaff();
    if (staff === 0) return 0;
    return Math.round((this.totalTeachers() / staff) * 100);
  });

  // Total Staff(teachers + workers)

  totalStaff = computed(() =>
    this.totalTeachers() + this.totalWorkers()
  );
  //Workers

  private workerService = inject(WorkerService);

  totalWorkers = computed(() =>
    this.workerService.workers().length
  );

  //Calculating the growth percentage of workers

  workerSharePercent = computed(() => {
    const staff = this.totalStaff();
    if (staff === 0) return 0;
    return Math.round((this.totalWorkers() / staff) * 100);
  });

  //Charts-section

  chartData = computed(() => {
    const students = this.studentService.students();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

    const counts = months.map((_, index) =>
      students.filter(s => {
        const date = new Date(s.enrollmentDate);
        return date.getMonth() === index;
      }).length
    );

    return {
      labels: months,
      datasets: [
        {
          label: 'Students',
          data: counts,
          borderColor: '#3b82f6',
          backgroundColor: 'transparent',
          tension: 0.4
        }
      ]
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#2563eb'
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
          color: '#94a3b8'
        },
        grid: {
          borderDash: [4, 4]
        }
      },
      x: {
        ticks: {
          color: '#94a3b8'
        },
        grid: {
          borderDash: [4, 4]
        }
      }
    }
  };


  // chart2

  basicData = computed(() => {
    const students = this.studentService.students();
    const grades = ['9th', '10th', '11th', '12th'];

    return {
      labels: grades,
      datasets: [
        {
          label: 'Students',
          data: grades.map(
            g => students.filter(s => s.grade === g).length
          ),
          backgroundColor: 'rgb(59, 130, 246)',
          borderRadius: 8
        }
      ]
    };
  });

  basicOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#334155'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b'
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      y: {
        min: 0,
        max: 40,
        ticks: {
          stepSize: 10,
          color: '#64748b'
        },
        grid: {
          color: '#e5e7eb',
          borderDash: [4, 4]
        }
      }

    }
  };

  // chart3

  data = computed(() => ({
    labels: ['Active', 'Inactive', 'Graduated'],
    datasets: [
      {
        data: [
          this.activeStudents(),
          this.inactiveStudents(),
          this.graduatedStudents()
        ],
        backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
        borderColor: '#ffffff',
        borderWidth: 2
      }
    ]
  }));

  options = {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: '#334155'
        }
      }
    }
  };

  // chart4

  barData = computed(() => {
    const teachers = this.teacherService.teachers();
    const students = this.studentService.students();

    const departments = Array.from(
      new Set([
        ...teachers.map(t => t.department),
        ...students.map(s => s.department)
      ])
    );

    return {
      labels: departments,
      datasets: [
        {
          label: 'Teachers',
          data: departments.map(
            d => teachers.filter(t => t.department === d).length
          ),
          backgroundColor: '#10b981',
          borderRadius: 8,
        },
        {
          label: 'Students',
          data: departments.map(
            d => students.filter(s => s.department === d).length
          ),
          backgroundColor: '#3b82f6',
          borderRadius: 8,
        }
      ]
    };
  });

  barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#334155',
          font: {
            weight: '500'
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (items: any[]) => items[0].label,
          label: (context: any) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#64748b',
        },
        grid: {
          drawBorder: false,
          color: '#e5e7eb'
        }
      },
      y: {
        min: 0,
        max: 10,
        beginAtZero: true,
        ticks: {
          color: '#64748b',
          stepSize: 2
        },
        grid: {
          drawBorder: false,
          color: '#e5e7eb'
        }
      }
    }
  };


  //Calculating the average 

  //average students 

  avgStudentsPerTeacher = computed(() => {
    const students = this.totalStudents();
    const teacers = this.totalTeachers();

    if (teacers === 0) return '0';
    return (students / teacers).toFixed(1);
  });

  // students rentention rate

  studentRetentionRate = computed(() => {
    const total = this.totalStudents();
    const active = this.activeStudents();

    if (total === 0) return 0;
    return Math.round((active / total) * 100);
  });

  // staff to student ratio

  staffToStudentRatio = computed(() => {
    const staff = this.totalTeachers() + this.totalWorkers();
    const students = this.totalStudents();

    if (students === 0) return '0.0';
    return `1:${Math.round(students / staff)}`;
  });


}
