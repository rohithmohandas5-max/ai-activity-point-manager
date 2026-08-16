import { CATEGORY_NAMES } from './nav';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: number;
  points: number;
  date: string;
  venue: string;
  deadline: string;
  eligibility: string;
  link: string;
  status: 'approved' | 'pending' | 'rejected';
  provider: string;
}

export interface CompletedActivity {
  id: string;
  title: string;
  category: number;
  points: number;
  date: string;
  status: 'Completed';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  points: {
    c1: number;
    c2: number;
    c3: number;
  };
}

export interface AdminStudent {
  id: string;
  name: string;
  department: string;
  c1: number;
  c2: number;
  c3: number;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  student_id: string | null;
  department: string | null;
  role:
    | 'student'
    | 'admin'
    | 'activity_provider'
    | string;
  created_at?: string;
}

export interface Recommendation {
  rank: number;
  activity: Activity;
  matchScore: number;
  reason: string;
}

export type ProofStatus =
  | 'not_submitted'
  | 'pending'
  | 'approved'
  | 'rejected';

export interface ProofSubmission {
  id: string;
  activityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  activityTitle: string;
  category: number;
  points: number;
  provider: string;
  fileName: string;
  fileType: string;
  previewUrl?: string;
  note: string;
  submissionDate: string;
  status: ProofStatus;
  rejectionReason?: string;
  pointsAwarded?: boolean;
}

export function categoryName(id: number): string {
  const category = CATEGORY_NAMES.find(
    (item) => item.id === id,
  );

  return category
    ? category.name
    : `Category ${id}`;
}