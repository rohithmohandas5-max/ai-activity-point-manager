import type { Student, Activity, ProofSubmission, CompletedActivity, Recommendation } from './data';
import { categoryName } from './data';
import { CATEGORY_MIN, TOTAL_MIN } from './nav';

export function totalPoints(s: Student): number {
  return s.points.c1 + s.points.c2 + s.points.c3;
}

export function totalRemaining(s: Student): number {
  return Math.max(0, TOTAL_MIN - totalPoints(s));
}

export function categoryRemaining(value: number): number {
  return Math.max(0, CATEGORY_MIN - value);
}

export function categoryComplete(value: number): boolean {
  return value >= CATEGORY_MIN;
}

export function isFullyComplete(s: Student): boolean {
  return (
    totalPoints(s) >= TOTAL_MIN &&
    categoryComplete(s.points.c1) &&
    categoryComplete(s.points.c2) &&
    categoryComplete(s.points.c3)
  );
}

export function adminStudentStatus(c1: number, c2: number, c3: number): 'Completed' | 'Incomplete' {
  const total = c1 + c2 + c3;
  if (total >= TOTAL_MIN && c1 >= CATEGORY_MIN && c2 >= CATEGORY_MIN && c3 >= CATEGORY_MIN) {
    return 'Completed';
  }
  return 'Incomplete';
}

export interface BuildRecommendationsParams {
  student: Student;
  activities: Activity[];
  registrations?: Set<string>;
  proofs?: ProofSubmission[];
  completed?: CompletedActivity[];
}

export function buildRecommendations({
  student,
  activities,
  registrations = new Set(),
  proofs = [],
  completed = [],
}: BuildRecommendationsParams): Recommendation[] {
  // Exclude activities the student is already registered for, submitted proof for, or completed
  const registeredIds = new Set(registrations);
  const proofActivityIds = new Set(
    proofs.filter((p) => p.studentId === student.id).map((p) => p.activityId),
  );
  const completedIds = new Set(completed.map((c) => c.id));
  const completedTitles = new Set(completed.map((c) => c.title.toLowerCase().trim()));

  const eligibleActivities = activities.filter((activity) => {
    // Only approved activities are candidates
    if (activity.status !== 'approved') return false;

    // Exclude if already registered
    if (registeredIds.has(activity.id)) return false;

    // Exclude if proof has been submitted (pending, approved, or rejected awaiting resubmission)
    if (proofActivityIds.has(activity.id)) return false;

    // Exclude if completed
    if (completedIds.has(activity.id) || completedIds.has(`comp-${activity.id}`)) return false;
    if (completedTitles.has(activity.title.toLowerCase().trim())) return false;

    return true;
  });

  const c1Rem = categoryRemaining(student.points.c1);
  const c2Rem = categoryRemaining(student.points.c2);
  const c3Rem = categoryRemaining(student.points.c3);
  const anyCategoryDeficient = c1Rem > 0 || c2Rem > 0 || c3Rem > 0;
  const totRem = totalRemaining(student);

  const recs: Recommendation[] = eligibleActivities.map((activity) => {
    let matchScore = 50;
    let reason = '';

    const catKey = `c${activity.category}` as keyof typeof student.points;
    const catPoints = student.points[catKey];
    const catRem = categoryRemaining(catPoints);

    if (anyCategoryDeficient) {
      if (catRem > 0) {
        // Activity category is deficient
        if (activity.points >= catRem) {
          matchScore = 95 + Math.min(4, Math.floor(activity.points / 5));
          reason = `Highly recommended because you need ${catRem} more ${categoryName(activity.category)} points. Completing this activity (${activity.points} pts) will satisfy your ${categoryName(activity.category)} minimum.`;
        } else {
          matchScore = 85 + Math.min(9, Math.floor((activity.points / catRem) * 9));
          reason = `Recommended because you still need ${catRem} more ${categoryName(activity.category)} points. This activity will contribute ${activity.points} points.`;
        }
      } else {
        // Activity category is satisfied (>=25), but other categories are deficient
        if (totRem > 0) {
          matchScore = 55 + Math.min(15, activity.points);
          reason = `Your ${categoryName(activity.category)} minimum is already completed, but this can contribute ${activity.points} points toward your ${TOTAL_MIN}-point total requirement.`;
        } else {
          matchScore = 40;
          reason = `Optional activity. Your ${categoryName(activity.category)} requirement is already met.`;
        }
      }
    } else if (totRem > 0) {
      // All category minimums (c1, c2, c3 >= 25) are satisfied, but overall total < 100
      matchScore = 80 + Math.min(15, Math.floor((activity.points / totRem) * 15));
      reason = `You have completed all category minimums and need ${totRem} more total points. This activity can help you reach the ${TOTAL_MIN}-point requirement.`;
    } else {
      // All requirements complete (>= 100 total & all categories >= 25)
      matchScore = 40 + Math.min(10, activity.points);
      reason = `All graduation requirements completed! This activity is available for extra enrichment.`;
    }

    return { rank: 0, activity, matchScore, reason };
  });

  recs.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.activity.points - a.activity.points;
  });

  recs.forEach((r, i) => (r.rank = i + 1));
  return recs;
}
