import { useState } from 'react';
import type { ReactNode } from 'react';
import { GraduationCap, Menu, X } from 'lucide-react';
import type { Role, NavItem } from '@/types/nav';
import { STUDENT_NAV, PROVIDER_NAV, ADMIN_NAV, LOGOUT_NAV } from '@/types/nav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  role: Role;
  activeKey: string;
  onNavigate: (key: string) => void;
  children: ReactNode;
}

const NAV_MAP: Record<Role, NavItem[]> = {
  student: STUDENT_NAV,
  provider: PROVIDER_NAV,
  admin: ADMIN_NAV,
};

const ROLE_LABEL: Record<Role, string> = {
  student: 'Student',
  provider: 'Activity Provider',
  admin: 'Administrator',
};

export function AppShell({ role, activeKey, onNavigate, children }: AppShellProps) {
  const nav = NAV_MAP[role];
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleNav(key: string) {
    onNavigate(key);
    setMobileOpen(false);
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-slate-800">AI Activity Point</p>
          <p className="text-xs leading-tight text-slate-400">Manager</p>
        </div>
      </div>

      <div className="mx-4 mb-3 rounded-xl bg-blue-50 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-500">Role</p>
        <p className="text-sm font-semibold text-blue-700">{ROLE_LABEL[role]}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {nav.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.key)}
              className={cn('sidebar-link w-full', isActive && 'sidebar-link-active')}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span>{item.label}</span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 px-3 py-3">
        <button onClick={() => handleNav(LOGOUT_NAV.key)} className="sidebar-link w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600">
          <LOGOUT_NAV.icon className="h-4.5 w-4.5 shrink-0" />
          <span>{LOGOUT_NAV.label}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-slate-200 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100">
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-slate-800">Activity Point Manager</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Close button for mobile when open */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed right-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden"
        >
          <X className="h-5 w-5 text-slate-600" />
        </button>
      )}
    </div>
  );
}
