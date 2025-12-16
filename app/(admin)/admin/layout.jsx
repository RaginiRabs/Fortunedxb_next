import ToastProvider from '@/providers/ToastProvider';
import ToastContainer from '@/components/admin/ToastContainer';

export const metadata = {
  title: 'Admin - Fortune DXB',
};

export default function AdminLayout({ children }) {
  return (
    <ToastProvider>
      {children}
      <ToastContainer />
    </ToastProvider>
  );
}