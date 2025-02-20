import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Truck,
  CreditCard,
  Package,
  Settings,
} from 'lucide-react';

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

const sidebarLinks: SidebarLink[] = [
  {
    icon: Users,
    label: 'Users',
    href: '/admin/users',
  },
  {
    icon: Building2,
    label: 'Condominiums',
    href: '/admin/condominiums',
  },
  {
    icon: Truck,
    label: 'Delivery Windows',
    href: '/admin/delivery-windows',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    href: '/admin/payment-methods',
  },
  {
    icon: Package,
    label: 'Egg Sizes',
    href: '/admin/egg-sizes',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings',
  },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>
          <nav className="mt-8">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={link.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {link.label}
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}