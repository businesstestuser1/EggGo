import { AuthForm } from '@/components/auth/auth-form';
import { Egg } from 'lucide-react';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Egg className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
          EggGo
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}