'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, CloudSun, Sunset, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Dữ liệu câu chúc phong phú
const GREETINGS = {
  morning: [ // 5h - 11h
    "Chúc bạn một ngày làm việc hiệu quả và tràn đầy năng lượng! 🚀",
    "Hãy bắt đầu ngày mới với nụ cười thật tươi nhé. ☀️",
    "Sẵn sàng bứt phá cho những mục tiêu hôm nay chưa?",
    "Một tách cà phê nóng sẽ giúp bạn tỉnh táo hơn đấy. ☕"
  ],
  noon: [ // 11h - 14h
    "Đừng quên nghỉ ngơi và ăn trưa đúng giờ nhé. 🍱",
    "Nạp lại năng lượng để chiến đấu tiếp nào!",
    "Một giấc ngủ trưa ngắn sẽ rất tốt cho sự tập trung đấy. 💤"
  ],
  afternoon: [ // 14h - 18h
    "Cố lên, sắp hoàn thành công việc trong ngày rồi! 💪",
    "Chiều rồi, vươn vai thư giãn một chút đi nào.",
    "Giữ vững phong độ cho những giờ làm việc cuối nhé."
  ],
  evening: [ // 18h - 22h
    "Về nhà thôi, hãy dành thời gian cho bản thân và gia đình. 🏠",
    "Thư giãn sau một ngày dài làm việc vất vả nhé. 🛁",
    "Chúc bạn có một buổi tối ấm áp và vui vẻ."
  ],
  night: [ // 22h - 5h
    "Muộn rồi, nhớ giữ gìn sức khỏe và ngủ sớm nhé. 🌙",
    "Đừng làm việc quá sức, 'Cú đêm' cũng cần nghỉ ngơi mà. 🦉",
    "Chúc bạn ngủ ngon và mơ những giấc mơ đẹp."
  ]
};

interface WelcomeCardProps {
  name?: string; // Tên user truyền vào
}

export function WelcomeCard({ name = "Bạn hiền" }: WelcomeCardProps) {
  const [greeting, setGreeting] = useState({
    title: "Xin chào",
    sub: "Chúc bạn một ngày tốt lành.",
    icon: <Sun className="h-8 w-8 text-yellow-500" />
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hour = new Date().getHours();
    let timeKey: keyof typeof GREETINGS = 'morning';
    let titleText = "";
    let iconEl = <Sun className="h-10 w-10 text-orange-400" />;

    // Logic xác định buổi
    if (hour >= 5 && hour < 11) {
      timeKey = 'morning';
      titleText = "Chào buổi sáng";
      iconEl = <Sun className="h-12 w-12 text-orange-400 animate-spin-slow" />;
    } else if (hour >= 11 && hour < 14) {
      timeKey = 'noon';
      titleText = "Chào buổi trưa";
      iconEl = <CloudSun className="h-12 w-12 text-yellow-500" />;
    } else if (hour >= 14 && hour < 18) {
      timeKey = 'afternoon';
      titleText = "Chào buổi chiều";
      iconEl = <Sunset className="h-12 w-12 text-orange-500" />;
    } else if (hour >= 18 && hour < 22) {
      timeKey = 'evening';
      titleText = "Chào buổi tối";
      iconEl = <Coffee className="h-12 w-12 text-indigo-400" />;
    } else {
      timeKey = 'night';
      titleText = "Chưa ngủ à?";
      iconEl = <Moon className="h-12 w-12 text-purple-400" />;
    }

    // Random câu chúc trong mảng
    const messages = GREETINGS[timeKey];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    setGreeting({
      title: titleText,
      sub: randomMsg,
      icon: iconEl
    });
  }, []);

  if (!mounted) return <div className="rounded-xl bg-muted/50 h-full w-full animate-pulse" />;

  return (
    // Dùng Gradient nhẹ nhàng làm nền để nổi bật hơn các ô khác
    <Card className="h-full border-none shadow-md bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative group">

      {/* Hiệu ứng nền trang trí */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {/* Icon background to đùng */}
        {React.cloneElement(greeting.icon as any, { className: "h-32 w-32 -mr-8 -mt-8" })}
      </div>

      <CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {greeting.icon}
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {greeting.title}, <span className="text-orange-600 dark:text-orange-400">{name}</span>!
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium mt-2 leading-relaxed">
            {greeting.sub}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2 text-xs text-slate-400">
          <span>Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}</span>
        </div>
      </CardContent>
    </Card>
  );
}