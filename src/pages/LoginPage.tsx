import { useState } from 'react';

import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import type { Role } from '@/types/nav';
import { supabase } from '@/utils/supabase';

interface LoginPageProps {
  onLogin: (role: Role) => void;
}

export function LoginPage({
  onLogin,
}: LoginPageProps) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  async function handleSubmit(
    event: React.FormEvent,
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      setErrorMessage(
        'Please enter your email address.',
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        'Please enter your password.',
      );

      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .signInWithPassword({
            email:
              cleanEmail,
            password,
          });

      if (error) {
        setErrorMessage(
          'Invalid email or password.',
        );

        return;
      }

      if (!data.user) {
        setErrorMessage(
          'Login failed. Please try again.',
        );

        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('role')
        .eq(
          'id',
          data.user.id,
        )
        .single();

      if (
        profileError ||
        !profile
      ) {
        await supabase.auth
          .signOut();

        setErrorMessage(
          'No profile was found for this account.',
        );

        return;
      }

      let appRole: Role;

      if (
        profile.role ===
        'student'
      ) {
        appRole = 'student';
      } else if (
        profile.role ===
        'activity_provider'
      ) {
        appRole = 'provider';
      } else if (
        profile.role ===
        'admin'
      ) {
        appRole = 'admin';
      } else {
        await supabase.auth
          .signOut();

        setErrorMessage(
          'This account does not have a valid application role.',
        );

        return;
      }

      onLogin(appRole);
    } catch (error) {
      console.error(
        'Login error:',
        error,
      );

      setErrorMessage(
        'Something went wrong while signing in. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
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

            <span className="text-lg font-bold">
              University Portal
            </span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              AI Activity Point
              Manager
            </h1>

            <p className="mt-4 text-lg text-blue-100">
              Track, manage, and
              complete activity-point
              requirements with
              intelligent activity
              recommendations.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <span className="text-sm">
                  Track your activity
                  points by category
                </span>
              </div>

              <div className="flex items-center gap-3 text-blue-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <span className="text-sm">
                  Register for approved
                  activities
                </span>
              </div>

              <div className="flex items-center gap-3 text-blue-100">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="h-4 w-4" />
                </div>

                <span className="text-sm">
                  Receive personalized
                  activity
                  recommendations
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-blue-200">
            University Activity
            Management System
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>

            <span className="text-lg font-bold text-slate-800">
              AI Activity Point
              Manager
            </span>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-slate-800">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in using your
              registered university
              account.
            </p>

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    disabled={
                      loading
                    }
                    onChange={(
                      event,
                    ) => {
                      setEmail(
                        event.target
                          .value,
                      );

                      setErrorMessage(
                        '',
                      );
                    }}
                    className="input-field pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="you@university.edu"
                    autoComplete="email"
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
                    value={
                      password
                    }
                    disabled={
                      loading
                    }
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event.target
                          .value,
                      );

                      setErrorMessage(
                        '',
                      );
                    }}
                    className="input-field pl-10 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
                  {
                    errorMessage
                  }
                </div>
              )}

              <button
                type="submit"
                disabled={
                  loading
                }
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Signing in...'
                  : 'Login'}

                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              Your dashboard is
              automatically selected
              based on your registered
              account role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}