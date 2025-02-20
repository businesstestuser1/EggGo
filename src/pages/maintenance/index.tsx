import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Users,
  Building2,
  Truck,
  CreditCard,
  Package,
  ArrowLeft,
} from 'lucide-react';

interface MaintenanceLink {
  icon: React.ElementType;
  label: string;
  href: string;
  description: string;
}

const maintenanceLinks: MaintenanceLink[] = [
  {
    icon: Users,
    label: 'Users',
    href: '/admin/users',
    description: 'Manage system users and their roles',
  },
  {
    icon: Building2,
    label: 'Condominiums',
    href: '/admin/condominiums',
    description: 'Manage residential complexes and their configurations',
  },
  {
    icon: Truck,
    label: 'Delivery Windows',
    href: '/admin/delivery-windows',
    description: 'Configure delivery schedules and time slots',
  },
  {
    icon: CreditCard,
    label: 'Payment Methods',
    href: '/admin/payment-methods',
    description: 'Manage available payment options',
  },
  {
    icon: Package,
    label: 'Egg Sizes',
    href: '/admin/egg-sizes',
    description: 'Configure product sizes and pricing',
  },
];

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Menu</h1>
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {maintenanceLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className="block group"
              >
                <div className="border rounded-lg p-6 hover:border-primary transition-colors">
                  <div className="flex items-center space-x-3 mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {link.label}
                    </h2>
                  </div>
                  <p className="text-gray-600">{link.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}