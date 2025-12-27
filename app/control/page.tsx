'use client';

import React, { useState, useEffect } from 'react';
import { ChartAreaInteractive } from '@/components/dashboard/chart';
import { Sun, CloudSun, Moon, Stars } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// --- COMPONENT CHÀO HỎI ---
const GreetingSection = () => {
  const [timeData, setTimeData] = useState({
    greeting: 'Xin chào',
    message: 'Chúc bạn một ngày tốt lành!',
    icon: Sun,
    gradient: 'from-orange-500/20 to-yellow-500/20', // Màu mặc định
    textColor: 'text-orange-500'
  });

  // Tên người dùng (Sau này cậu lấy từ API hoặc Context)
  const userName = "Hoàng Khiêm";

  useEffect(() => {
    const hour = new Date().getHours();

    // Data lời chúc phong phú
    const wishes = {
      morning: [
        "Chúc bạn một ngày mới tràn đầy năng lượng!",
        "Khởi đầu ngày mới thật hiệu quả nhé.",
        "Đừng quên tách cà phê cho ngày mới tỉnh táo!",
        "Hôm nay trời đẹp đấy, hãy làm việc thật tốt nhé."
      ],
      afternoon: [
        "Chúc bạn một buổi chiều làm việc tập trung.",
        "Đã đi được nửa chặng đường trong ngày rồi, cố lên!",
        "Nhớ uống đủ nước và thư giãn một chút nhé.",
        "Buổi chiều vui vẻ và năng suất nhé."
      ],
      evening: [
        "Về nhà nghỉ ngơi thư giãn thôi nào.",
        "Một ngày vất vả rồi, hãy tận hưởng buổi tối nhé.",
        "Chúc bạn một buổi tối ấm áp bên gia đình.",
        "Sạc lại năng lượng để chuẩn bị cho ngày mai nhé."
      ],
      night: [
        "Khuya rồi, hãy nhớ giữ gìn sức khỏe nhé.",
        "Chúc bạn ngủ ngon và có những giấc mơ đẹp.",
        "Không gian yên tĩnh thật tuyệt để suy ngẫm."
      ]
    };

    // Hàm lấy ngẫu nhiên 1 lời chúc
    const getRandomWish = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    // Logic xác định thời gian
    if (hour >= 5 && hour < 12) {
      setTimeData({
        greeting: 'Chào buổi sáng',
        message: getRandomWish(wishes.morning),
        icon: Sun,
        gradient: 'from-orange-500/20 to-amber-500/10',
        textColor: 'text-orange-500'
      });
    } else if (hour >= 12 && hour < 18) {
      setTimeData({
        greeting: 'Chào buổi chiều',
        message: getRandomWish(wishes.afternoon),
        icon: CloudSun,
        gradient: 'from-blue-500/20 to-cyan-500/10',
        textColor: 'text-blue-500'
      });
    } else if (hour >= 18 && hour < 22) {
      setTimeData({
        greeting: 'Chào buổi tối',
        message: getRandomWish(wishes.evening),
        icon: Moon,
        gradient: 'from-indigo-500/20 to-purple-500/10',
        textColor: 'text-indigo-500'
      });
    } else {
      setTimeData({
        greeting: 'Đêm muộn rồi',
        message: getRandomWish(wishes.night),
        icon: Stars,
        gradient: 'from-slate-800/50 to-zinc-900/50',
        textColor: 'text-slate-400'
      });
    }
  }, []);

  const Icon = timeData.icon;

  return (
    <Card className={`border-none shadow-sm bg-gradient-to-r ${timeData.gradient}`}>
      <CardContent className="p-6 md:p-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            {timeData.greeting}, <span className={timeData.textColor}>{userName}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            {timeData.message}
          </p>
        </div>

        {/* Icon trang trí bên phải */}
        <div className={`p-4 rounded-full bg-white/10 backdrop-blur-sm hidden md:block ${timeData.textColor}`}>
          <Icon className="h-12 w-12 md:h-16 md:w-16 opacity-80" />
        </div>
      </CardContent>
    </Card>
  );
};

// --- COMPONENT CHÍNH ---
export default function ManPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">

      {/* 1. Phần Chào hỏi (Thay thế 3 ô vuông cũ) */}
      <div className="w-full">
        <GreetingSection />
      </div>

      {/* 2. Biểu đồ lớn (Giữ nguyên) */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min border border-border/50 shadow-sm">
        <ChartAreaInteractive />
      </div>
    </div>
  );
}