import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { StudentService } from '../../services/student-service';
import { TeacherService } from '../../services/teacher-service';
import { WorkerService } from '../../services/worker-service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardModule, CommonModule, NgxEchartsDirective],
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

  activeStudents = computed(() => {
    return this.studentService.students().filter(s =>
      !!s.enrollmentDate && !isNaN(new Date(s.enrollmentDate).getTime())
    ).length;
  });

  inactiveStudents = computed(() => {
    return this.studentService.students().filter(s =>
      !s.enrollmentDate || isNaN(new Date(s.enrollmentDate).getTime())
    ).length;
  });
  
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

  // E-Charts

  //Line Chart

  enrollmentOption = computed(() => {
    const students = this.studentService.students();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const counts = months.map((_, i) =>
    students.filter(s => {
      if (!s.enrollmentDate) return false;
 
      const d = new Date(s.enrollmentDate);
      return !isNaN(d.getTime()) && d.getMonth() === i;
    }).length
  );

    const colors = this.chartColors();

    return {
      tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLabel: {
        interval: 0,
        color: colors.text
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      // max: 10,
      // interval: 1,
      axisLabel: {
        color: colors.text
      },
      splitLine: {
        lineStyle: {
          color: colors.grid
        }
      }
    },
    series: [
      {
        name: 'Enrollment',
        type: 'line',
        data: counts,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#3b82f6',
          width: 3
        },
        itemStyle: {
          color: '#3b82f6'
        }
      }
    ]
    };
  });

  //Bar Chart

  basicBarOption = computed(() => {
    const students = this.studentService.students();
    const colors = this.chartColors();

    const courses = Array.from(
      new Set(students.map(s => s.course).filter(c => !!c))
    );

    const data = courses.map(
      c => students.filter(s => s.course === c).length
    );

    return {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: courses,
        axisLabel: {
          color: colors.text,
          interval: 0    
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 10,
        axisLabel: { color: colors.text },
        splitLine: {
          lineStyle: {
            color: colors.grid
          }
        }
      },
      series: [
        {
          name: 'Students',
          type: 'bar',
          data,
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [6, 6, 0, 0]
          }
        }
      ]
    };
  });

  //Pie Chart

  yearsPieOption = computed(() => {
    const colors = this.chartColors();
    const students = this.studentService.students();
    const yearCounts = students.reduce((acc: Record<string, number>, s) => {
      if (s.year !== null && s.year !== undefined) {
        const key = `Year ${s.year}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const years = Object.keys(yearCounts);

    const palette = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    const data = years.map((y, i) => ({
      value: yearCounts[y],
      name: y,
      itemStyle: { color: palette[i % palette.length] }
    }));

  return {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: { color: colors.text }
    },
    series: [
      {
        name: 'Students',
        type: 'pie',
        radius: '65%',
        data,
        label: { color: colors.text },
        itemStyle: {
          borderColor: colors.border,
          borderWidth: 2
        }
      }
    ]
  };
  });

  // Bar Chart

  departmentOption = computed(() => {
    const teachers = this.teacherService.teachers();
    const students = this.studentService.students();
    const depts = Array.from(new Set([...teachers.map(t => t.department), ...students.map(s => s.course)])).filter(d => d);

    const colors = this.chartColors();

    return {
       tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Teachers', 'Students'],
      textStyle: {
        color: colors.text
      }
    },
    xAxis: {
      type: 'category',
      data: depts,
      axisLabel: {
        interval: 0,
        color: colors.text
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: colors.text
      },
      splitLine: {
        lineStyle: {
          color: colors.grid
        }
      }
    },
    series: [
      {
        name: 'Teachers',
        type: 'bar',
        data: depts.map(d =>
          teachers.filter(t => t.department === d).length
        ),
        itemStyle: {
          color: '#10b981',
          borderRadius: [4, 4, 0, 0]
        }
      },
      {
        name: 'Students',
        type: 'bar',
        data: depts.map(d =>
          students.filter(s => s.course === d).length
        ),
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [4, 4, 0, 0]
        }
      }
    ]
    };
  });
  
  // --- Summary Calculations ---

  avgStudentsPerTeacher = computed(() => 
    this.totalTeachers() === 0 ? '0' :
   (this.totalStudents() / this.totalTeachers()).toFixed(2));
 
  studentRetentionRate = computed(() => {
    const total = this.totalStudents();
    if (total === 0) return 0;
    const active = this.activeStudents();
    return Math.round((active / total) * 100);
  });

  staffToStudentRatio = computed(() => {
    const staff = this.totalStaff();
    const students = this.totalStudents();
    if (staff === 0 || students === 0) return '0:0';
    const perStaff = Math.max(1, Math.round(students / staff));
    return `1:${perStaff}`;
  });
}