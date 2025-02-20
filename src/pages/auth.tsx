import { useState } from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Button } from '@/components/ui/button';
import { Egg } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

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
          {isLogin ? <AuthForm /> : <RegisterForm />}
          
          <div className="mt-6">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/maintenance">
                View Maintenance Menu
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}