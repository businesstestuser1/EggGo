import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  adminCode: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE;

export function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      username: '',
      adminCode: '',
    },
  });

  const adminCode = watch('adminCode');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verify admin code if attempting admin registration
      if (isAdmin && data.adminCode !== ADMIN_SECRET_CODE) {
        throw new Error('Invalid administrator code');
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            username: data.username,
          },
        },
      });

      if (signUpError) throw signUpError;

      // If registration is successful and it's an admin, assign the admin role
      if (signUpData.user && isAdmin) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: signUpData.user.id,
            role_id: (await supabase
              .from('roles')
              .select('id')
              .eq('name', 'admin')
              .single()
            ).data?.id,
          });

        if (roleError) throw roleError;
      }

      // Clear form and navigate to dashboard on success
      reset();
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            {...register('fullName')}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            {...register('username')}
            placeholder="Choose a username"
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isAdmin"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="isAdmin">Register as Administrator</Label>
        </div>

        {isAdmin && (
          <div className="space-y-2">
            <Label htmlFor="adminCode">Administrator Code</Label>
            <Input
              id="adminCode"
              type="password"
              {...register('adminCode')}
              placeholder="Enter administrator code"
            />
            {errors.adminCode && (
              <p className="text-sm text-red-500">{errors.adminCode.message}</p>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>
    </div>
  );
}