import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/types/supabase';

type Condominium = Database['public']['Tables']['condominiums']['Row'] & {
  type: Database['public']['Tables']['condominium_types']['Row'];
  distribution_type: Database['public']['Tables']['distribution_types']['Row'];
};

const columns: ColumnDef<Condominium>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type.name',
    header: 'Type',
  },
  {
    accessorKey: 'distribution_type.name',
    header: 'Distribution Type',
  },
  {
    accessorKey: 'has_lobby',
    header: 'Has Lobby',
    cell: ({ row }) => {
      return row.getValue('has_lobby') ? 'Yes' : 'No';
    },
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

export default function CondominiumsPage() {
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCondominiums() {
      try {
        const { data, error } = await supabase
          .from('condominiums')
          .select(`
            *,
            type:condominium_types(*),
            distribution_type:distribution_types(*)
          `)
          .order('name');
        
        if (error) throw error;
        setCondominiums(data);
      } catch (error) {
        console.error('Error loading condominiums:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCondominiums();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Condominiums</h1>
      <DataTable columns={columns} data={condominiums} searchColumn="name" />
    </div>
  );
}