import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Award,
  CalendarDays,
  Sparkles,
  CheckCircle2,
  UserCircle,
  LogOut,
  PlusCircle,
  ListChecks,
  Users,
  ShieldCheck,
  ClipboardList,
  ClipboardCheck,
  FileCheck,
} from 'lucide-react';

export type Role = 'student' | 'provider' | 'admin';

export interface NavItem {
  label: string;
  key: string;
  icon: LucideIcon;
}

export const STUDENT_NAV: NavItem[] = [
  { label: 'Dashboard', key: 'student-dashboard', icon: LayoutDashboard },
  { label: 'My Activity Points', key: 'student-points', icon: Award },
  { label: 'Activities', key: 'student-activities', icon: CalendarDays },
  { label: 'Registered Activities', key: 'student-registered', icon: FileCheck },
  { label: 'AI Recommendations', key: 'student-ai', icon: Sparkles },
  { label: 'Completed Activities', key: 'student-completed', icon: CheckCircle2 },
  { label: 'Profile', key: 'student-profile', icon: UserCircle },
];

export const PROVIDER_NAV: NavItem[] = [
  { label: 'Dashboard', key: 'provider-dashboard', icon: LayoutDashboard },
  { label: 'Add Activity', key: 'provider-add', icon: PlusCircle },
  { label: 'My Activities', key: 'provider-activities', icon: ListChecks },
  { label: 'Participants', key: 'provider-participants', icon: Users },
];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', key: 'admin-dashboard', icon: LayoutDashboard },
  { label: 'Students', key: 'admin-students', icon: Users },
  { label: 'Activity Providers', key: 'admin-providers', icon: ShieldCheck },
  { label: 'Activities', key: 'admin-activities', icon: CalendarDays },
  { label: 'Approvals', key: 'admin-approvals', icon: ClipboardList },
  { label: 'Point Verifications', key: 'admin-verifications', icon: ClipboardCheck },
];

export const LOGOUT_NAV: NavItem = { label: 'Logout', key: 'logout', icon: LogOut };

export interface ActivityCategory {
  id: number;
  name: string;
}

export const CATEGORY_NAMES: ActivityCategory[] = [
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
];

export const CATEGORY_MIN = 25;
export const TOTAL_MIN = 100;
