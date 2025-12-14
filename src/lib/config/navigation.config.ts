import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  BarChart3,
  Crown,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'AI Builder',
        href: '/builder/new',
        icon: Sparkles,
        badge: 'New',
      },
    ],
  },
  {
    label: 'Career',
    items: [
      {
        label: 'Jobs',
        href: '/jobs',
        icon: Briefcase,
      },
      {
        label: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    items: [
      {
        label: 'Premium',
        href: '/premium',
        icon: Crown,
      },
    ],
  },
  {
    items: [
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
];
