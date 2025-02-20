import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Order = Database['public']['Tables']['orders']['Row'] & {
  status: Database['public']['Tables']['order_statuses']['Row'];
  customer_address: Database['public']['Tables']['customer_addresses']['Row'];
};

export default function DashboardPage() {
  const { user, hasRole } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      if (!user) return;

      let query = supabase
        .from('orders')
        .select(`
          *,
          status:order_statuses(*),
          customer_address:customer_addresses(*)
        `);

      if (hasRole('customer')) {
        query = query.eq('customer_id', user.id);
      } else if (hasRole('delivery')) {
        query = query.eq('status.name', 'in_delivery');
      }

      const { data, error } = await query;

      if (error) throw error;
      setOrders(data as Order[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="font-semibold">Recent Orders</h2>
          <div className="mt-4 space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_address.unit_identifier}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    order.status.name === 'delivered'
                      ? 'bg-green-100 text-green-800'
                      : order.status.name === 'in_delivery'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional dashboard widgets will go here */}
      </div>
    </div>
  );
}