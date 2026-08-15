import type { ActivityCategory } from './nav';
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
  year: number;
  points: { c1: number; c2: number; c3: number };
}

export interface AdminStudent {
  id: string;
  name: string;
  department: string;
  c1: number;
  c2: number;
  c3: number;
}

export const SAMPLE_STUDENT: Student = {
  id: 'stu-1',
  name: 'Rohith Mohandas',
  email: 'rohith.m@university.edu',
  department: 'Artificial Intelligence and Data Science',
  year: 3,
  points: { c1: 32, c2: 18, c3: 27 },
};

export const SAMPLE_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    title: 'Coding Hackathon',
    description:
      'A 24-hour intensive coding marathon where teams build innovative solutions to real-world problems. Mentors, food, and prizes included.',
    category: 2,
    points: 15,
    date: 'September 18, 2026',
    venue: 'Innovation Lab, Block C',
    deadline: 'September 15, 2026',
    eligibility: 'All UG students, Year 2 and above',
    link: 'https://university.edu/register/coding-hackathon',
    status: 'approved',
    provider: 'Coding Club',
  },
  {
    id: 'act-2',
    title: 'AI Workshop',
    description:
      'Hands-on workshop covering fundamentals of machine learning, neural networks, and prompt engineering. Certificate provided on completion.',
    category: 2,
    points: 10,
    date: 'September 10, 2026',
    venue: 'Seminar Hall 2, Block A',
    deadline: 'September 7, 2026',
    eligibility: 'All students welcome',
    link: 'https://university.edu/register/ai-workshop',
    status: 'approved',
    provider: 'AI Department',
  },
  {
    id: 'act-3',
    title: 'NSS Volunteer Camp',
    description:
      'A weekend community service camp organized by the National Service Scheme. Participate in tree plantation, awareness drives, and rural outreach.',
    category: 3,
    points: 10,
    date: 'September 25, 2026',
    venue: 'Adopted Village, Outskirts',
    deadline: 'September 22, 2026',
    eligibility: 'NSS registered students',
    link: 'https://university.edu/register/nss-camp',
    status: 'approved',
    provider: 'NSS Cell',
  },
  {
    id: 'act-4',
    title: 'Sports Tournament',
    description:
      'Inter-department sports tournament featuring cricket, football, badminton, and athletics. Compete for your department and earn points.',
    category: 1,
    points: 10,
    date: 'September 20, 2026',
    venue: 'University Sports Complex',
    deadline: 'September 17, 2026',
    eligibility: 'All students with medical clearance',
    link: 'https://university.edu/register/sports-tournament',
    status: 'approved',
    provider: 'Sports Board',
  },
  {
    id: 'act-ml',
    title: 'Machine Learning Competition',
    description:
      'A competitive ML challenge where students build predictive models on a provided dataset. Top performers receive certificates and activity points.',
    category: 2,
    points: 12,
    date: 'September 28, 2026',
    venue: 'AI Lab, Block D',
    deadline: 'September 25, 2026',
    eligibility: 'All UG students, Year 2 and above',
    link: 'https://university.edu/register/ml-competition',
    status: 'approved',
    provider: 'AI Department',
  },
  {
    id: 'act-5',
    title: 'Technical Paper Presentation',
    description:
      'Present a research paper on emerging AI technologies before a faculty panel. Top three presentations receive awards.',
    category: 2,
    points: 12,
    date: 'October 5, 2026',
    venue: 'Conference Hall, Block B',
    deadline: 'October 1, 2026',
    eligibility: 'Year 3 and above students',
    link: 'https://university.edu/register/paper-presentation',
    status: 'pending',
    provider: 'AI Department',
  },
  {
    id: 'act-6',
    title: 'Entrepreneurship Bootcamp',
    description:
      'A 3-day bootcamp on startup fundamentals, pitching, and funding. Industry experts mentor student teams through idea validation.',
    category: 1,
    points: 8,
    date: 'October 12, 2026',
    venue: 'Incubation Center',
    deadline: 'October 8, 2026',
    eligibility: 'All UG and PG students',
    link: 'https://university.edu/register/entrepreneurship',
    status: 'pending',
    provider: 'Innovation Cell',
  },
];

export const SAMPLE_COMPLETED: CompletedActivity[] = [
  { id: 'c-1', title: 'Tech Fest Volunteer', category: 1, points: 12, date: 'Aug 12, 2026', status: 'Completed' },
  { id: 'c-2', title: 'Inter-College Quiz', category: 1, points: 10, date: 'Jul 28, 2026', status: 'Completed' },
  { id: 'c-3', title: 'Department Seminar Talk', category: 1, points: 10, date: 'Jul 15, 2026', status: 'Completed' },
  { id: 'c-4', title: 'Coding Workshop', category: 2, points: 10, date: 'Aug 5, 2026', status: 'Completed' },
  { id: 'c-5', title: 'Debug Contest', category: 2, points: 8, date: 'Jun 22, 2026', status: 'Completed' },
  { id: 'c-6', title: 'NSS Tree Plantation', category: 3, points: 10, date: 'Aug 20, 2026', status: 'Completed' },
  { id: 'c-7', title: 'Blood Donation Camp', category: 3, points: 10, date: 'Jul 30, 2026', status: 'Completed' },
  { id: 'c-8', title: 'Community Awareness Drive', category: 3, points: 7, date: 'Jun 18, 2026', status: 'Completed' },
];

export const SAMPLE_ADMIN_STUDENTS: AdminStudent[] = [
  { id: 's-1', name: 'Rohith Mohandas', department: 'AI & Data Science', c1: 32, c2: 18, c3: 27 },
  { id: 's-2', name: 'Ananya Sharma', department: 'Computer Science', c1: 40, c2: 25, c3: 35 },
  { id: 's-3', name: 'Vikram Nair', department: 'Electronics', c1: 50, c2: 20, c3: 35 },
  { id: 's-4', name: 'Priya Iyer', department: 'Mechanical', c1: 28, c2: 30, c3: 25 },
  { id: 's-5', name: 'Arjun Reddy', department: 'Information Tech', c1: 15, c2: 22, c3: 30 },
  { id: 's-6', name: 'Sneha Pillai', department: 'AI & Data Science', c1: 30, c2: 28, c3: 45 },
  { id: 's-7', name: 'Karthik Menon', department: 'Civil', c1: 20, c2: 15, c3: 18 },
  { id: 's-8', name: 'Divya Raghavan', department: 'Computer Science', c1: 35, c2: 35, c3: 35 },
];

export const SAMPLE_PROVIDERS = [
  { id: 'p-1', name: 'Coding Club', activities: 2, students: 145 },
  { id: 'p-2', name: 'AI Department', activities: 3, students: 210 },
  { id: 'p-3', name: 'NSS Cell', activities: 1, students: 98 },
  { id: 'p-4', name: 'Sports Board', activities: 1, students: 176 },
  { id: 'p-5', name: 'Innovation Cell', activities: 1, students: 67 },
];

export interface Recommendation {
  rank: number;
  activity: Activity;
  matchScore: number;
  reason: string;
}

export type ProofStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

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

export const SAMPLE_PROOFS: ProofSubmission[] = [
  {
    id: 'proof-1',
    activityId: 'act-3',
    studentId: 'stu-2',
    studentName: 'Ananya Sharma',
    studentEmail: 'ananya.s@university.edu',
    activityTitle: 'NSS Volunteer Camp',
    category: 3,
    points: 10,
    provider: 'NSS Cell',
    fileName: 'nss_certificate.pdf',
    fileType: 'application/pdf',
    note: 'Completed the weekend camp and received this certificate.',
    submissionDate: 'Sep 2, 2026',
    status: 'pending',
  },
  {
    id: 'proof-2',
    activityId: 'act-4',
    studentId: 'stu-3',
    studentName: 'Vikram Nair',
    studentEmail: 'vikram.n@university.edu',
    activityTitle: 'Sports Tournament',
    category: 1,
    points: 10,
    provider: 'Sports Board',
    fileName: 'sports_participation.jpg',
    fileType: 'image/jpeg',
    note: 'Participated in the inter-department football tournament.',
    submissionDate: 'Sep 5, 2026',
    status: 'pending',
  },
];

export function categoryName(id: number): string {
  const c = CATEGORY_NAMES.find((cat) => cat.id === id);
  return c ? c.name : `Category ${id}`;
}
