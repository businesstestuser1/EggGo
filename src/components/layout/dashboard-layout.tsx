import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Building2,
  Settings,
  LogOut,
  Truck,
  MessageSquare,
  Wrench,
} from 'lucide-react';

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
  roles: string[];
}

const sidebarLinks: SidebarLink[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/dashboard',
    roles: ['admin', 'customer', 'delivery'],
  },
  {
    icon: ShoppingCart,
    label: 'Orders',
    href: '/orders',
    roles: ['admin', 'customer', 'delivery'],
  },
  {
    icon: MessageSquare,
    label: 'Chat',
    href: '/chat',
    roles: ['admin', 'customer', 'delivery'],
  },
  {
    icon: Wrench,
    label: 'Admin Menu',
    href: '/maintenance',
    roles: ['admin'],
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    roles: ['admin', 'customer', 'delivery'],
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { hasRole } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.some((role) => hasRole(role))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">EggGo</h1>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              {filteredLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate(link.href)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  </li>
                );
              })}
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}