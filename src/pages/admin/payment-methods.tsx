import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/types/supabase';

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row'];

const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      return row.getValue('is_active') ? 'Active' : 'Inactive';
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return new Date(row.getValue('created_at')).toLocaleDateString();
    },
  },
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setPaymentMethods(data);
      } catch (error) {
        console.error('Error loading payment methods:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPaymentMethods();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Payment Methods</h1>
      <DataTable columns={columns} data={paymentMethods} searchColumn="name" />
    </div>
  );
}