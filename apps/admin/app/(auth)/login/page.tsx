'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, User, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface LoginProps {
  onLogin: (user: { id: string; email: string; name: string; type: 'citizen' | 'subadmin' | 'superadmin'; assignedArea?: string }) => void;
  onSwitchToSignup: () => void;
}

export default function Login({ onLogin, }: LoginProps) {
  const [userType, setUserType] = useState<'User' | 'SubAdmin' | 'SuperAdmin'>('User');  
  // "User" | "SuperAdmin" | "SubAdmin";
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: userType
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
//   const mockCredentials = {
//     citizen: {
//       email: 'citizen@demo.com',
//       password: 'citizen123',
//       name: 'John Doe',
//       assignedArea: undefined
//     },
//     subadmin: {
//       email: 'subadmin@city.gov',
//       password: 'subadmin123',
//       name: 'Sub Admin User',
//       assignedArea: 'Downtown'
//     },
//     superadmin: {
//       email: 'superadmin@city.gov',
//       password: 'superadmin123',
//       name: 'Super Admin User',
//       assignedArea: undefined
//     }
//   };

 const onSwitchToSignup = () => {
    router.push('/signup');
 }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
        // Add login logic here
    const response = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
      role: userType,
    });
    if (response?.error) {
      console.log("error");
      toast.error("Invalid credentials. Please try again.");
    } else {
      console.log("login");
      toast.success("Logged in successfully!");
      setSuccess(true);
    }
    if (response?.url) {
       if(userType === 'User') {
        router.replace('/');
    }
    else {
        router.replace('/');
    }}
    setIsLoading(false);

    console.log(response);
    console.log("Logging in with:", formData);
  };

  if (success) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Account Created!</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to the Civic Issue Reporting System. You'll be redirected
                to the app in a moment.
              </p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto" />
            </CardContent>
          </Card>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-muted-foreground">
            Sign in to your civic reporting account
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* User Type Selection */}
          <div className="grid grid-cols-3 gap-2">
            {/* <Button
              type="button"
              variant={userType === 'User' ? 'default' : 'outline'}
              onClick={() => setUserType('User')}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Citizen
            </Button> */}
            <Button
              type="button"
              variant={userType === 'SubAdmin' ? 'default' : 'outline'}
              onClick={() => setUserType('SubAdmin')}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Sub Admin
            </Button>
            <Button
              type="button"
              variant={userType === 'SuperAdmin' ? 'default' : 'outline'}
              onClick={() => setUserType('SuperAdmin')}
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Super Admin
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing In...
                </>
              ) : (
                `Sign In as ${userType === 'User' ? 'Citizen' : userType === 'SubAdmin' ? 'Sub Admin' : 'Super Admin'}`
              )}
            </Button>
          </form>


    <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>

     </CardContent>
      </Card> 

      {/* Info Card */}
      {/* <div className="hidden lg:block absolute bottom-8 left-8 max-w-sm">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Quick Demo Access</p>
                <p className="text-muted-foreground">
                  Use the demo buttons to quickly explore both citizen and admin interfaces
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      {/* </div> */}
    </div>
  );
}