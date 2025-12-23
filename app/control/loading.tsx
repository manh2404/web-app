// app/control/loading.tsx
import GlobalLoading from '@/components/ui/global-loading';

export default function Loading() {
  // Component này sẽ tự động được Next.js render khi chuyển đổi giữa các route con
  // ví dụ: /control/user <-> /control/projects <-> /control/projects/workitem
  return <GlobalLoading />;
}