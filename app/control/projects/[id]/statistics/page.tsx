'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation'; // Lấy ID dự án
import {
  BarChart3, CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar, Users, Loader2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// --- INTERFACES CHO DỮ LIỆU API ---
interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  memberCount: number;
  progressData: { name: string; completed: number; ongoing: number }[];
  statusDistribution: { name: string; value: number; color: string }[];
  memberPerformance: { name: string; done: number; total: number; perf: string }[];
}

export default function StatisticsPage() {
  const params = useParams();
  const projectId = params?.id;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ProjectStats | null>(null);

  // --- HÀM GỌI API LẤY DỮ LIỆU THẬT ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Gọi API với projectId lấy từ URL
        const response = await axios.get(`/api/projects/${projectId}/statistics`);
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
        toast.error("Không thể tải dữ liệu thống kê dự án");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchStats();
    }
  }, [projectId]);

  // --- TRẠNG THÁI LOADING ---
  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-zinc-500 text-sm">Đang phân tích dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Tính phần trăm hoàn thành tổng thể
  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full w-full p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar bg-[#050505]">

      {/* HEADER TRANG */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Thống kê Dự án
            <Badge variant="outline" className="ml-2 border-indigo-500/30 text-indigo-400 bg-indigo-500/10">Live Data</Badge>
          </h1>
          <p className="text-muted-foreground text-sm">Dữ liệu thời gian thực từ cơ sở dữ liệu.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
          <Badge variant="secondary" className="bg-transparent text-zinc-400 hover:bg-transparent">
            <Calendar className="h-3 w-3 mr-1" /> {new Date().toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* 1. HÀNG CHỈ SỐ TỔNG QUAN (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Tiến độ chung',
            value: `${completionRate}%`,
            sub: `${stats.completedTasks}/${stats.totalTasks} Task`,
            icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10'
          },
          {
            label: 'Đang thực hiện',
            value: `${stats.inProgressTasks} Task`,
            sub: 'Cần đẩy nhanh',
            icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10'
          },
          {
            label: 'Quá hạn / Rủi ro',
            value: `${stats.overdueTasks} Task`,
            sub: 'Cần xử lý gấp',
            icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10'
          },
          {
            label: 'Thành viên',
            value: `${stats.memberCount} Dev`,
            sub: 'Đang hoạt động',
            icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10'
          },
        ].map((stat, i) => (
          <Card key={i} className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative group hover:border-white/20 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-[10px] text-zinc-500">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. KHU VỰC BIỂU ĐỒ CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Biểu đồ Area Chart (Dữ liệu thật từ stats.progressData) */}
        <Card className="lg:col-span-2 bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Velocity (Tốc độ hoàn thành) - 7 ngày qua
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.progressData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="completed" name="Hoàn thành" stroke="#6366f1" fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
                <Area type="monotone" dataKey="ongoing" name="Đang làm" stroke="#eab308" fillOpacity={0} strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ Bar Chart Dọc (Dữ liệu thật từ stats.statusDistribution) */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white">
              <BarChart3 className="h-4 w-4 text-indigo-400" /> Tỷ lệ trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full flex flex-col">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.statusDistribution} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={10} width={80} tick={{fill: '#a1a1aa'}} />
                  <Tooltip
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend chú thích */}
            <div className="mt-4 space-y-3 pt-4 border-t border-white/5">
              {stats.statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full ring-2 ring-white/5" style={{ backgroundColor: item.color }}></div>
                    <span className="text-zinc-300 font-medium">{item.name}</span>
                  </div>
                  <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. BẢNG HIỆU SUẤT THÀNH VIÊN (Real Data) */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-white">Đóng góp của thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.memberPerformance.length > 0 ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs uppercase bg-white/5 text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Thành viên</th>
                  <th className="px-4 py-3 font-medium">Task xong / Tổng</th>
                  <th className="px-4 py-3 font-medium">Thanh tiến độ</th>
                  <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Hiệu suất</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                {stats.memberPerformance.map((user, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors group">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300 border border-indigo-500/30 group-hover:border-indigo-400 transition-colors">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{user.done} / <span className="text-zinc-500">{user.total}</span></td>
                    <td className="px-4 py-3 w-1/3">
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                          style={{ width: user.total > 0 ? `${(user.done/user.total)*100}%` : '0%' }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant="secondary" className="font-mono bg-indigo-500/10 text-indigo-300 border-0">
                        {user.perf}
                      </Badge>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 italic">Chưa có dữ liệu thành viên nào hoạt động.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}