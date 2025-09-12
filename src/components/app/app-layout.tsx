'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  History,
  Github,
  LogOut,
  Shield,
  BarChart,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '../icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { ThemeToggle } from '../theme-toggle';
import useLocalStorage from '@/hooks/use-local-storage';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useLocalStorage('auth', { isAuthenticated: false, role: 'user' });

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, role: null });
    router.push('/login');
  };

  const menuItems =
  auth.role === 'admin'
    ? [
        {
          href: '/admin',
          icon: <Shield />,
          label: 'Admin Dashboard',
          isActive: pathname === '/admin',
        },
      ]
    : [
        {
          href: '/dashboard',
          icon: <LayoutDashboard />,
          label: 'Dashboard',
          isActive: pathname === '/dashboard',
        },
        {
          href: '/history',
          icon: <History />,
          label: 'Trip History',
          isActive: pathname === '/history',
        },
        {
            href: '/stats',
            icon: <BarChart />,
            label: 'Statistics',
            isActive: pathname === '/stats',
        }
      ];


  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-headline font-semibold text-sidebar-foreground">
              TripMapper
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
               <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref>
                    <SidebarMenuButton asChild isActive={item.isActive} tooltip={item.label}>
                      <span>
                        {item.icon}
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </Link>
               </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-2">
           <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" data-ai-hint="person face" />
                  <AvatarFallback>{auth.role === 'admin' ? 'A' : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                  <span className="text-sm font-medium text-sidebar-foreground capitalize">{auth.role}</span>
                  <span className="text-xs text-sidebar-foreground/70">{auth.role}@tripmapper.com</span>
              </div>
           </div>
           <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70" onClick={handleLogout}>
             <LogOut className="mr-2 h-4 w-4" />
             Logout
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold md:text-2xl font-headline capitalize">
                  {pathname.substring(1) || 'Dashboard'}
              </h1>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/firebase/studio" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                </a>
            </Button>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
