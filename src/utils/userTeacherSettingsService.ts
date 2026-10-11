import { StudentProfile, UserTeacherPreference, ExamPaperRecord, Course } from '../types';
import { loadStudentProfile, saveStudentProfile } from './studentProfile';

const TEACHER_PREFS_KEY_PREFIX = 'examintel_teacher_prefs_';
const USER_ROLE_KEY = 'examintel_user_role_v1';
const ORGANIZER_PAPERS_KEY = 'examintel_organizer_papers_v1';

export const DEFAULT_TEACHER_PREFERENCES: Record<string, UserTeacherPreference> = {
  'course-sem1-chemistry': {
    teacherName: 'Chemistry Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: true,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Prefers chemical reaction flowcharts, balanced chemical equations for EDTA/Cement, and step-by-step arithmetic for Calorific Value numericals.',
    languagePreference: 'English'
  },
  'course-sem1-math1': {
    teacherName: 'Mathematics Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: false,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Strictly grade intermediate derivatives y1, y2 before applying Leibnitz theorem. Box the final recurrence relation at x=0 with units.',
    languagePreference: 'English'
  },
  'course-sem1-mechanical': {
    teacherName: 'Mechanical Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: true,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Draw neat p-v and T-s indicator diagrams for Otto/Diesel cycles. State all SFEE assumptions and box net work in kW.',
    languagePreference: 'English'
  },
  'course-sem1-electronics': {
    teacherName: 'Electronics Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: false,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Must include circuit diagram and input/output waveforms. Derive ripple factor step-by-step (r = 0.482).',
    languagePreference: 'English'
  },
  'course-sem2-physics': {
    teacherName: 'Physics Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: true,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Newton rings ray diagram is mandatory. Show path difference Stokes shift of lambda/2 explicitly.',
    languagePreference: 'English'
  },
  'course-sem2-electrical': {
    teacherName: 'Electrical Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: true,
      diagram: true,
      stepByStep: true,
      boxedAnswer: true,
      strictDeductions: true
    },
    customInstructions: 'Deactivate independent sources clearly for Rth. State units (V, Ohm, A) on every intermediate line.',
    languagePreference: 'English'
  },
  'course-sem2-cpp': {
    teacherName: 'Computer Science Faculty (IET-DAVV)',
    preferredFormatting: {
      flowchart: true,
      diagram: false,
      stepByStep: true,
      boxedAnswer: false,
      strictDeductions: true
    },
    customInstructions: 'Provide clear OOP class definitions, virtual destructor, and memory management with new/delete.',
    languagePreference: 'English'
  }
};

/**
 * Load teacher preferences for a specific course
 */
export function getTeacherPreferenceForCourse(courseId: string): UserTeacherPreference {
  try {
    const raw = localStorage.getItem(`${TEACHER_PREFS_KEY_PREFIX}${courseId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load teacher preference', e);
  }

  return (
    DEFAULT_TEACHER_PREFERENCES[courseId] || {
      teacherName: 'University Professor',
      preferredFormatting: {
        flowchart: true,
        diagram: true,
        stepByStep: true,
        boxedAnswer: true,
        strictDeductions: true
      },
      customInstructions: 'Requires step-by-step derivations, standard formulas, and boxed final answers.',
      languagePreference: 'English'
    }
  );
}

/**
 * Save customized teacher preference for a course
 */
export function saveTeacherPreferenceForCourse(
  courseId: string,
  pref: UserTeacherPreference
): void {
  try {
    const updated = { ...pref, lastUpdated: new Date().toLocaleDateString() };
    localStorage.setItem(`${TEACHER_PREFS_KEY_PREFIX}${courseId}`, JSON.stringify(updated));

    // Also sync into main profile
    const profile = loadStudentProfile();
    const existing = profile.teacherPreferences || {};
    existing[courseId] = updated;
    saveStudentProfile({ ...profile, teacherPreferences: existing });
  } catch (e) {
    console.error('Failed to save teacher preference', e);
  }
}

/**
 * Manage User Role: 'student' (upload my section's paper) or 'organizer' (upload official master papers)
 */
export function getUserRole(): 'student' | 'organizer' {
  try {
    const saved = localStorage.getItem(USER_ROLE_KEY);
    if (saved === 'organizer' || saved === 'student') {
      return saved;
    }
    const profile = loadStudentProfile();
    if (profile.role) return profile.role;
  } catch (e) {
    // fallback
  }
  return 'student';
}

export function setUserRole(role: 'student' | 'organizer'): void {
  try {
    localStorage.setItem(USER_ROLE_KEY, role);
    const profile = loadStudentProfile();
    saveStudentProfile({ ...profile, role });
  } catch (e) {
    console.error('Failed to save user role', e);
  }
}

/**
 * Check if a paper was uploaded by an organizer
 */
export function isPaperOrganizerUploaded(paper: Partial<ExamPaperRecord>): boolean {
  if (paper.isOrganizerPaper === true) return true;
  // If paper ID contains preset / organizer tag
  if (paper.id && (paper.id.startsWith('paper-') || paper.id.includes('mst1-2024') || paper.id.includes('mst2-2024'))) {
    return true;
  }
  return false;
}
