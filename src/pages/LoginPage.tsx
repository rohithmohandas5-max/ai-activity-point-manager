import { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Users,
  User,
} from 'lucide-react';
import type { Role } from '@/types/nav';
import { cn } from '@/lib/utils';
import { supabase } from '@/utils/supabase';

interface LoginPageProps {
  onLogin: (role: Role) => void;
}

const ROLES: { value: Role; label: string; icon: typeof User }[] = [
  { value: 'student', label: 'Student', icon: User },
  { value: 'provider', label: 'Activity Provider', icon: Users },
  { value: 'admin', label: 'Administrator', icon: ShieldCheck },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('rohith.m@university.edu');
  const [password, setPassword] = useState('demo123');
  const [role, setRole] = useState<Role>('student');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedRole = ROLES.find((r) => r.value === role)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setErrorMessage('Login failed.');
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setErrorMessage('No profile was found for this account.');
      setLoading(false);
      return;
    }

    const appRole: Role =
      profile.role === 'activity_provider'
        ? 'provider'
        : (profile.role as Role);

    onLogin(appRole);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950 lg:flex">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -left-10 bottom-10 h-96 w-96 rounded-full bg-white" />
          <div className="absolute right-1/3 top-1/2 h-40 w-40 rounded-full bg-white" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold">University Portal</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              AI Activity Point Manager
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Track, manage, and complete your activity points with intelligent
              recommendations powered by AI.
            </p>

            <div className="mt-8 space-y-3">
              {[
                '100 total points required to graduate',
                '25 points minimum in each of 3 categories',
                'AI-powered activity recommendations',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-blue-100"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
                    {'\u2713'}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-blue-200">
            University Activity Management System.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold text-slate-800">
              AI Activity Point Manager
            </span>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@university.edu"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Role
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    className="input-field flex items-center justify-between pl-4 text-left"
                  >
                    <span className="flex items-center gap-2">
                      <selectedRole.icon className="h-4 w-4 text-slate-500" />
                      {selectedRole.label}
                    </span>

                    <ChevronDown
                      className={cn(
                        'h-4 w-4 text-slate-400 transition-transform',
                        dropdownOpen && 'rotate-180',
                      )}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {ROLES.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => {
                            setRole(r.value);
                            setDropdownOpen(false);
                          }}
                          className={cn(
                            'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-blue-50',
                            role === r.value
                              ? 'text-blue-700'
                              : 'text-slate-700',
                          )}
                        >
                          <r.icon className="h-4 w-4" />
                          {r.label}

                          {role === r.value && (
                            <span className="ml-auto text-blue-600">
                              {'\u2713'}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {errorMessage && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {errorMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Login'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Sign in using your registered account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}