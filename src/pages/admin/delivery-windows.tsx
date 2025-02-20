import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/types/supabase';

type DeliveryWindow = Database['public']['Tables']['delivery_windows']['Row'] & {
  condominium: Database['public']['Tables']['condominiums']['Row'];
};

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const columns: ColumnDef<DeliveryWindow>[] = [
  {
    accessorKey: 'condominium.name',
    header: 'Condominium',
  },
  {
    accessorKey: 'day_of_week',
    header: 'Day',
    cell: ({ row }) => {
      return DAYS_OF_WEEK[row.getValue('day_of_week')];
    },
  },
  {
    accessorKey: 'start_time',
    header: 'Start Time',
  },
  {
    accessorKey: 'end_time',
    header: 'End Time',
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

export default function DeliveryWindowsPage() {
  const [deliveryWindows, setDeliveryWindows] = useState<DeliveryWindow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeliveryWindows() {
      try {
        const { data, error } = await supabase
          .from('delivery_windows')
          .select(`
            *,
            condominium:condominiums(*)
          `)
          .order('day_of_week')
          .order('start_time');
        
        if (error) throw error;
        setDeliveryWindows(data);
      } catch (error) {
        console.error('Error loading delivery windows:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDeliveryWindows();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delivery Windows</h1>
      <DataTable 
        columns={columns} 
        data={deliveryWindows} 
        searchColumn="condominium.name" 
      />
    </div>
  );
}