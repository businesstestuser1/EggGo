import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  created_at: string;
  roles: string[];
}

const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'full_name',
    header: 'Full Name',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as string[];
      return (
        <div className="flex gap-1">
          {roles.map((role) => (
            <Badge key={role} variant={role === 'admin' ? 'destructive' : 'secondary'}>
              {role}
            </Badge>
          ))}
        </div>
      );
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

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const { data, error } = await supabase
          .from('user_profiles_secure')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setUsers(data || []);
        setError(null);
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 my-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <DataTable columns={columns} data={users} searchColumn="email" />
    </div>
  );
}