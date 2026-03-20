'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navigationConfig, type NavItem } from '@/lib/config/navigation.config';
import { useSidebar } from '@/hooks/useSidebar';

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href ||
    (item.href === '/dashboard' && pathname === '/') ||
    (item.href.startsWith('/builder') && pathname.startsWith('/builder'));

  const content = (
    <>
      <item.icon
        className={cn('shrink-0', collapsed ? 'h-5 w-5' : 'h-4 w-4')}
      />
      {!collapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#eef2ff] text-[#4f46e5] rounded">
              {item.badge}
            </span>
          )}
        </>
      )}
    </>
  );

  const className = cn(
    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f46e5]',
    collapsed && 'justify-center',
    isActive
      ? 'bg-[#eef2ff] text-[#4f46e5] font-semibold'
      : 'text-[#64748b] hover:bg-[#f5f3ff] hover:text-[#11101d]',
    item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
  );

  if (item.disabled) {
    return (
      <div className={className} title={`${item.label} (Coming Soon)`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
    >
      {content}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 bg-[#1e1b4b] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          {item.label}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const { collapsed } = useSidebar();

  const handleNavClick = () => {
    if (mobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={cn(
        'h-screen bg-white border-r border-[#e2e8f0] transition-all duration-300',
        !mobile && 'fixed left-0 top-0 z-40',
        !mobile && (collapsed ? 'w-16' : 'w-64'),
        !mobile && 'hidden md:block',
        mobile && 'w-full'
      )}
      aria-label="Sidebar navigation"
    >
      <div className="flex h-full flex-col">
        {!mobile && (
          <div className="flex h-16 items-center border-b border-[#e2e8f0] px-3 pr-16">
            <button
              onClick={() => useSidebar.getState().toggle()}
              className="flex items-center justify-center rounded-lg p-2 text-[#64748b] hover:bg-[#f5f3ff] hover:text-[#11101d] transition-colors"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {collapsed ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                )}
              </svg>
            </button>
          </div>
        )}

        <nav
          className={cn('flex-1 space-y-1 p-3', mobile && 'pt-16')}
          aria-label="Main navigation"
        >
          {navigationConfig.map((group, idx) => (
            <div key={idx}>
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  collapsed={mobile ? false : collapsed}
                  onClick={handleNavClick}
                />
              ))}
              {idx < navigationConfig.length - 1 && (
                <div className="my-3 border-t border-[#e2e8f0]" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
