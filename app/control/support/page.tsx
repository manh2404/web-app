'use client';

import React, { useState } from 'react';
import {
  Search,
  LifeBuoy,
  MessageCircle,
  FileText,
  Mail,
  ChevronRight,
  Book,
  CreditCard,
  Settings,
  Shield,
  Zap,
  LayoutGrid,
  Users
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import GlobalLoading from '@/components/ui/global-loading';
import { cn } from '@/lib/utils'; // Import thêm cn để gộp class cho gọn

// Dữ liệu mẫu
const faqItems = [
  {
    icon: Users,
    question: "Thêm thành viên vào dự án",
    answer: "Vào Cài đặt dự án > Thành viên > Nhập email và mời."
  },
  {
    icon: Shield,
    question: "Đặt lại mật khẩu",
    answer: "Bấm 'Quên mật khẩu' ở màn hình đăng nhập để nhận email reset."
  },
  {
    icon: LayoutGrid,
    question: "Tùy chỉnh Kanban Board",
    answer: "Kéo thả các cột hoặc vào cấu hình để thêm trạng thái mới."
  },
  {
    icon: FileText,
    question: "Xuất báo cáo Excel",
    answer: "Nút Export nằm ở góc trên bên phải của trang Work Items."
  }
];

export default function SupportPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAction = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    // 👇 CẬP NHẬT Ở ĐÂY: Thêm bộ class tùy chỉnh thanh cuộn (Scrollbar)
    <div className={cn(
      "flex flex-col h-full w-full bg-muted/10 p-6 overflow-y-auto relative",
      // CSS cho thanh cuộn:
      "[&::-webkit-scrollbar]:w-2", // Độ rộng 8px
      "[&::-webkit-scrollbar-track]:bg-transparent", // Nền trong suốt
      "[&::-webkit-scrollbar-thumb]:bg-zinc-300", // Màu thanh cuộn (Sáng)
      "dark:[&::-webkit-scrollbar-thumb]:bg-zinc-800", // Màu thanh cuộn (Tối - Dark mode)
      "[&::-webkit-scrollbar-thumb]:rounded-full", // Bo tròn
      "dark:[&::-webkit-scrollbar-thumb]:hover:bg-zinc-700" // Màu khi di chuột vào
    )}>

      {/* Hiệu ứng Loading đỏ */}
      {isLoading && <GlobalLoading />}

      {/* --- HERO SECTION --- */}
      <div className="relative mb-25 text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-red-600 to-indigo-600 shadow-lg text-white shrink-0">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Xin chào, chúng tôi có thể giúp gì?
        </h1>
        <p className="text-blue-100 max-w-xl mx-auto mb-8">
          Tra cứu tài liệu, hướng dẫn sử dụng và giải đáp thắc mắc về Batek System.
        </p>

        <div className="max-w-lg mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
          </div>
          <Input
            className="pl-10 h-12 bg-white text-black border-0 shadow-xl focus-visible:ring-0 placeholder:text-gray-400 rounded-xl"
            placeholder="Gõ từ khóa tìm kiếm (VD: lỗi login, API...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* --- QUICK ACTIONS --- */}
      <div className="grid gap-6 md:grid-cols-3 mb-10 -mt-16 px-4 shrink-0">
        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-0" onClick={handleAction}>
          <CardHeader className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Gửi Ticket</CardTitle>
              <CardDescription>Báo lỗi hoặc yêu cầu hỗ trợ kỹ thuật.</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-0" onClick={handleAction}>
          <CardHeader className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Book className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Tài liệu</CardTitle>
              <CardDescription>Hướng dẫn sử dụng chi tiết A-Z.</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-0" onClick={handleAction}>
          <CardHeader className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Chat trực tiếp với Admin (Online).</CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="grid gap-8 lg:grid-cols-3 shrink-0">

        {/* Cột Trái */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" /> Chủ đề hỗ trợ
          </h3>
          <div className="grid gap-3">
            {[
              { label: "Tài khoản & Bảo mật", icon: Shield },
              { label: "Quản lý Dự án", icon: Zap },
              { label: "Thanh toán", icon: CreditCard },
              { label: "Cài đặt hệ thống", icon: Settings },
            ].map((item, idx) => (
              <Button
                key={idx}
                variant="outline"
                className="justify-between h-auto py-4 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 group transition-all"
                onClick={handleAction}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-blue-600" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              </Button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 mt-6 shadow-md">
            <h4 className="font-bold mb-2">Không tìm thấy câu trả lời?</h4>
            <p className="text-gray-300 text-sm mb-4">
              Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
            <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={handleAction}>
              <Mail className="mr-2 h-4 w-4" /> Liên hệ ngay
            </Button>
          </div>
        </div>

        {/* Cột Phải */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" /> Câu hỏi phổ biến
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 pb-10">
            {faqItems.map((item, index) => (
              <Card key={index} className="hover:border-primary/50 cursor-pointer transition-colors group" onClick={handleAction}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </CardContent>
                <CardFooter className="pt-0">
                       <span className="text-xs text-blue-500 font-medium flex items-center hover:underline">
                          Xem chi tiết <ChevronRight className="h-3 w-3 ml-1" />
                       </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}