import { StudentProfile, SubjectTrackingData, SubjectTaskItem, Course } from '../types';

const PROFILE_KEY = 'examintel_student_profile_v1';
const TRACKING_KEY_PREFIX = 'examintel_subject_tracking_';

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Devendra Mishra',
  college: 'IET-DAVV Indore',
  branch: 'B.Tech Engineering',
  rollNumber: '0801CS241042'
};

export function loadStudentProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_STUDENT_PROFILE;
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getDefaultTasksForCourse(course: Course): SubjectTaskItem[] {
  const tasks: SubjectTaskItem[] = [];

  course.syllabus.forEach((unit) => {
    const examTag: 'MST-1' | 'MST-2' | 'End-Sem' =
      unit.unit <= 2 ? 'MST-1' : unit.unit <= 4 ? 'MST-2' : 'End-Sem';

    // Core derivation task
    tasks.push({
      id: `${course.id}-u${unit.unit}-t1`,
      text: `Master Unit ${unit.unit} Core Proof: ${unit.subtopics?.[0] || unit.title}`,
      unit: unit.unit,
      completed: false,
      examTag
    });

    // Practice numericals task
    tasks.push({
      id: `${course.id}-u${unit.unit}-t2`,
      text: `Solve 4 University PYQs on ${unit.title.split('&')[0].trim()}`,
      unit: unit.unit,
      completed: false,
      examTag
    });
  });

  // Past paper mock test tasks
  tasks.push({
    id: `${course.id}-mock-mst1`,
    text: `Complete Timed Solve: 2024 MST-1 Past Paper (1 Hour / 20 Marks)`,
    unit: 1,
    completed: false,
    examTag: 'MST-1'
  });

  tasks.push({
    id: `${course.id}-mock-endsem`,
    text: `Complete Master Review: End-Semester Past Question Paper`,
    unit: 5,
    completed: false,
    examTag: 'End-Sem'
  });

  return tasks;
}

export function loadSubjectTracking(course: Course): SubjectTrackingData {
  try {
    const raw = localStorage.getItem(`${TRACKING_KEY_PREFIX}${course.id}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load tracking data', e);
  }

  return {
    courseId: course.id,
    deadlineDays: 14,
    targetEfficiency: 85,
    targetExam: 'MST-1',
    completedTaskIds: []
  };
}

export function saveSubjectTracking(courseId: string, data: SubjectTrackingData): void {
  try {
    localStorage.setItem(`${TRACKING_KEY_PREFIX}${courseId}`, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save tracking data', e);
  }
}

const TASKS_KEY_PREFIX = 'examintel_subject_tasks_';

export function loadSubjectTasks(course: Course): SubjectTaskItem[] {
  try {
    const raw = localStorage.getItem(`${TASKS_KEY_PREFIX}${course.id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load tasks', e);
  }
  const defaultTasks = getDefaultTasksForCourse(course);
  saveSubjectTasks(course.id, defaultTasks);
  return defaultTasks;
}

export function saveSubjectTasks(courseId: string, tasks: SubjectTaskItem[]): void {
  try {
    localStorage.setItem(`${TASKS_KEY_PREFIX}${courseId}`, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}
