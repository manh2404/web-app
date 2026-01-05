'use client';

import { SidebarIcon } from 'lucide-react';

import { SearchForm } from '@/components/search-form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSidebar } from '@/components/ui/sidebar';

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    // 👇 THAY ĐỔI LỚN NHẤT Ở ĐÂY:
    // 1. bg-white/10: Nền trắng mờ nhẹ.
    // 2. backdrop-blur-md: Hiệu ứng làm mờ phía sau.
    // 3. border-white/10: Viền dưới mờ ảo.
    <header className="sticky top-0 z-50 flex w-full items-center border-b border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md transition-all">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">

        {/* Nút Toggle Sidebar: Chỉnh màu trắng mờ */}
        <Button
          className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/10"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>

        {/* Đường gạch dọc: Chỉnh màu trắng mờ */}
        <Separator orientation="vertical" className="mr-2 h-4 bg-white/20" />

        {/* Breadcrumb: Chỉnh màu chữ sang trắng/xám sáng */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                className="text-white/60 hover:text-white transition-colors"
              >
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="text-white/40" />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium drop-shadow-sm">
                Data Fetching
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search Form */}
        <SearchForm className="w-full min-w-[300px] sm:ml-auto sm:w-auto" />
      </div>
    </header>
  );
}