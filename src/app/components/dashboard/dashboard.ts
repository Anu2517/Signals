import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { WorkerService } from '../../services/worker-service';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CardModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  private studentService = inject(StudentService);
  private teacherService = inject(TeacherService);
  private workerService = inject(WorkerService);

  private observer: MutationObserver | null = null;

  isDarkMode = signal(false);

  ngOnInit() {
    this.checkTheme();
    this.observer = new MutationObserver(() => this.checkTheme());
    this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  ngOnDestroy() {
    if (this.observer) this.observer.disconnect();
  }

  private checkTheme() {
    const isDark = document.documentElement.classList.contains('p-dark') ||
      document.body.classList.contains('dark-theme');
    this.isDarkMode.set(isDark);
  }

  private chartColors = computed(() => {
    return this.isDarkMode()
      ? { text: '#f8fafc', grid: 'rgba(255, 255, 255, 0.1)', border: '#475569' }
      : { text: '#64748b', grid: 'rgba(0, 0, 0, 0.05)', border: '#e2e8f0' };
  });

  // Calculations of studnets
  totalStudents = computed(() => 
    this.studentService.students().length);

  activeStudents = computed(() => 
    this.studentService.students().filter(s => s.status === 'Active').length);

  inactiveStudents = computed(() => 
    this.studentService.students().filter(s => s.status === 'Inactive').length);

  graduatedStudents = computed(() => 
    this.studentService.students().filter(s => s.status === 'Graduated').length);


  studentGrowthPercent = computed(() => {
    const students = this.studentService.students();
    if (students.length === 0) return 0;
 
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
 
    const currentCount = students.filter(s => new Date(s.enrollmentDate).getFullYear() === currentYear).length;
    const previousCount = students.filter(s => new Date(s.enrollmentDate).getFullYear() === lastYear).length;
 
    if (currentCount === 0 && previousCount > 0) {
      return Math.round(((currentCount - previousCount) / previousCount) * 100);
    }
 
    if (previousCount === 0)
      return currentCount > 0 ? 100 : 0;
 
    return Math.round(((currentCount - previousCount) / previousCount) * 100);
  });

  // Calculations of teachers
  totalTeachers = computed(() => 
    this.teacherService.teachers().length);

  totalWorkers = computed(() => 
    this.workerService.workers().length);

  totalStaff = computed(() => this.totalTeachers() + this.totalWorkers());

  teacherSharePercent = computed(() => {
    const staff = this.totalStaff();
    return staff === 0 ? 0 : Math.round((this.totalTeachers() / staff) * 100);
  });

  // Calculations of workers
  totalDepartments = computed(() => {
    const departments = this.teacherService.teachers().map(t => t.department);
    return new Set(departments.filter(d => d)).size;
  });

  workerSharePercent = computed(() => {
    const staff = this.totalStaff();
    return staff === 0 ? 0 : Math.round((this.totalWorkers() / staff) * 100);
  });

  // Charts

  chartData = computed(() => {
    const students = this.studentService.students();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = months.map((_, i) => students.filter(s => new Date(s.enrollmentDate).getMonth() === i).length);
    return {
      labels: months,
      datasets: [
        { 
          label: 'Enrollment', 
          data: counts, 
          borderColor: '#3b82f6', 
          tension: 0.4 }]
    };
  });

  basicData = computed(() => {
    const students = this.studentService.students();
    const grades = ['9th', '10th', '11th', '12th'];
    return {
      labels: grades,
      datasets: [
        { 
          label: 'Students', 
          data: grades.map(g => students.filter(s => s.grade === g).length), 
          backgroundColor: '#3b82f6', 
          borderRadius: 6 }]
    };
  });

  data = computed(() => ({
    labels: ['Active', 'Inactive', 'Graduated'],
    datasets: [{
      data: [this.activeStudents(), this.inactiveStudents(), this.graduatedStudents()],
      backgroundColor: ['#10b981', '#ef4444', '#3b82f6'],
      borderWidth: 2
    }]
  }));

  barData = computed(() => {
    const teachers = this.teacherService.teachers();
    const students = this.studentService.students();
    const depts = Array.from(new Set([...teachers.map(t => t.department), ...students.map(s => s.department)])).filter(d => d);
    return {
      labels: depts,
      datasets: [
        { label: 'Teachers', 
          data: depts.map(d => teachers.filter(t => t.department === d).length), 
          backgroundColor: '#10b981', 
          borderRadius: 4 
        },
        { label: 'Students', 
          data: depts.map(d => students.filter(s => s.department === d).length), 
          backgroundColor: '#3b82f6', 
          borderRadius: 4 
        }
      ]
    };
  });

  // --- Chart Options ---
  chartOptions = computed(() => this.getOptions());
  basicOptions = computed(() => this.getOptions(true));
  barOptions = computed(() => this.getOptions(true));
  options = computed(() => {
  const colors = this.chartColors();

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: colors.text  
        }
      },
      tooltip: {
        titleColor: colors.text,
        bodyColor: colors.text
      }
    }
  };
});


  private getOptions(showGrid = true) {
    const colors = this.chartColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: colors.text 
          }
        }
      },
      scales: {
        y: {
          ticks: {
            color: colors.text 
          },
          grid: {
            color: colors.grid, 
            display: showGrid,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: colors.text 
          },
          grid: {
            color: colors.grid, 
            display: showGrid,
            drawBorder: false
          }
        }
      }
    };
  }

  // --- Summary Calculations ---

  avgStudentsPerTeacher = computed(() => 
    this.totalTeachers() === 0 ? '0' :
   (this.totalStudents() / this.totalTeachers()).toFixed(1));


  studentRetentionRate = computed(() => 
    this.totalStudents() === 0 ? 0 : 
    Math.round((this.activeStudents() / this.totalStudents()) * 100));


  staffToStudentRatio = computed(() => 
    this.totalStudents() === 0 ? '0.0' :
   `1:${Math.round(this.totalStudents() / this.totalStaff())}`);
}