import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  ClipboardList,
  FileText,
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
        badge: 'AI',
      },
      {
        label: 'Cover Letters',
        href: '/cover-letters',
        icon: FileText,
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        label: 'Applications',
        href: '/applications',
        icon: ClipboardList,
      },
      {
        label: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      },
    ],
  },
];
