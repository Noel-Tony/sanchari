import AdminDashboardClient from '@/components/app/admin-dashboard-client';
import AdminLayout from './layout';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardClient />
    </AdminLayout>
  );
}
