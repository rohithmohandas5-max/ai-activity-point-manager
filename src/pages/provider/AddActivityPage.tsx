import { useState } from 'react';
import { PlusCircle, CheckCircle2, X } from 'lucide-react';
import type { Activity } from '@/types/data';
import { CATEGORY_NAMES } from '@/types/nav';
import { PageHeader } from '@/components/PageHeader';

interface AddActivityPageProps {
  onSubmit: (activity: Activity) => void;
  onCancel: () => void;
}

export function AddActivityPage({ onSubmit, onCancel }: AddActivityPageProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 1,
    points: '',
    date: '',
    deadline: '',
    venue: '',
    eligibility: '',
    link: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newActivity: Activity = {
      id: `act-${Date.now()}`,
      title: form.title,
      description: form.description,
      category: Number(form.category),
      points: Number(form.points),
      date: form.date,
      venue: form.venue,
      deadline: form.deadline,
      eligibility: form.eligibility,
      link: form.link || 'https://university.edu/register',
      status: 'pending',
      provider: 'You',
    };
    onSubmit(newActivity);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onCancel();
    }, 1500);
  }

  return (
    <div>
      <PageHeader title="Add Activity" subtitle="Create a new activity for students" icon={<PlusCircle className="h-5 w-5" />} />

      {submitted && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 p-4 text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-semibold">Activity submitted successfully! It will appear in your activity list.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card max-w-3xl p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Activity Name</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="input-field"
              placeholder="e.g. AI Workshop"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="input-field resize-none"
              placeholder="Describe the activity..."
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Activity Point Category</label>
            <select
              value={form.category}
              onChange={(e) => update('category', Number(e.target.value))}
              className="input-field"
            >
              {CATEGORY_NAMES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Points Offered</label>
            <input
              type="number"
              required
              min={1}
              max={50}
              value={form.points}
              onChange={(e) => update('points', e.target.value)}
              className="input-field"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Activity Date</label>
            <input
              type="text"
              required
              value={form.date}
              onChange={(e) => update('date', e.target.value)}
              className="input-field"
              placeholder="e.g. October 15, 2026"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Registration Deadline</label>
            <input
              type="text"
              required
              value={form.deadline}
              onChange={(e) => update('deadline', e.target.value)}
              className="input-field"
              placeholder="e.g. October 12, 2026"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Venue</label>
            <input
              type="text"
              required
              value={form.venue}
              onChange={(e) => update('venue', e.target.value)}
              className="input-field"
              placeholder="e.g. Seminar Hall 2"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Eligibility</label>
            <input
              type="text"
              required
              value={form.eligibility}
              onChange={(e) => update('eligibility', e.target.value)}
              className="input-field"
              placeholder="e.g. All students welcome"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Registration Link</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => update('link', e.target.value)}
              className="input-field"
              placeholder="https://university.edu/register/..."
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button type="submit" className="btn-primary">
            <PlusCircle className="h-4 w-4" /> Submit Activity
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
