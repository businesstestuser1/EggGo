import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/types/supabase';

type EggSize = Database['public']['Tables']['egg_sizes']['Row'];

const columns: ColumnDef<EggSize>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => {
      return `$${row.getValue('price')}`;
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

export default function EggSizesPage() {
  const [eggSizes, setEggSizes] = useState<EggSize[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEggSizes() {
      try {
        const { data, error } = await supabase
          .from('egg_sizes')
          .select('*')
          .order('price', { ascending: true });
        
        if (error) throw error;
        setEggSizes(data);
      } catch (error) {
        console.error('Error loading egg sizes:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEggSizes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Egg Sizes</h1>
      <DataTable columns={columns} data={eggSizes} searchColumn="name" />
    </div>
  );
}