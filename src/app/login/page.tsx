'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Logo } from '@/components/icons/logo';
import useLocalStorage from '@/hooks/use-local-storage';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  role: z.enum(['user', 'admin']),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [, setAuth] = useLocalStorage('auth', { isAuthenticated: false, role: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd verify credentials against a backend.
      // For this prototype, any login is successful.
      setAuth({ isAuthenticated: true, role: values.role });
      
      if (values.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }, 1000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="items-center text-center">
          <Logo className="mb-4 h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
          <CardDescription className="text-md">
            Sign in to continue to TripMapper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                       <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={field.value === 'user' ? 'default' : 'outline'}
                          onClick={() => field.onChange('user')}
                        >
                          User
                        </Button>
                        <Button
                           type="button"
                           variant={field.value === 'admin' ? 'default' : 'outline'}
                           onClick={() => field.onChange('admin')}
                        >
                          Admin
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@tripmapper.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
