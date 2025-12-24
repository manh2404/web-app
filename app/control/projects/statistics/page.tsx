'use client';

import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// --- DỮ LIỆU GIẢ LẬP ---
const progressData = [
  { name: 'Mon', completed: 4, ongoing: 10 },
  { name: 'Tue', completed: 7, ongoing: 8 },
  { name: 'Wed', completed: 5, ongoing: 12 },
  { name: 'Thu', completed: 12, ongoing: 9 },
  { name: 'Fri', completed: 18, ongoing: 5 },
  { name: 'Sat', completed: 10, ongoing: 4 },
  { name: 'Sun', completed: 15, ongoing: 3 },
];

const statusDistribution = [
  { name: 'Done', value: 45, color: '#22c55e' },
  { name: 'In Progress', value: 30, color: '#eab308' },
  { name: 'Todo', value: 15, color: '#3b82f6' },
  { name: 'Backlog', value: 10, color: '#94a3b8' },
];

export default function StatisticsPage() {
  return (
    <div className="flex flex-col h-full w-full p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">

      {/* HEADER TRANG */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Thống kê Dự án</h1>
          <p className="text-muted-foreground text-sm">Theo dõi tiến độ và hiệu suất công việc trong Sprint này.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
          <Badge variant="ghost" className="text-indigo-400"><Calendar className="h-3 w-3 mr-1" /> Dec 2024</Badge>
          <Badge variant="outline" className="border-white/10 text-white/60">Sprint 24</Badge>
        </div>
      </div>

      {/* 1. HÀNG CHỈ SỐ TỔNG QUAN (Stats Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Hoàn thành', value: '45%', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Đang chạy', value: '12 Task', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { label: 'Quá hạn', value: '03 Task', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Thành viên', value: '08 Dev', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((stat, i) => (
          <Card key={i} className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden relative group hover:border-white/20 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <stat.icon className="h-12 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. KHU VỰC BIỂU ĐỒ CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Biểu đồ tiến độ (Area Chart) - Chiếm 2/3 */}
        <Card className="lg:col-span-2 bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> Biểu đồ tiến độ công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
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
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" fillOpacity={1} fill="url(#colorComp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ phân bổ trạng thái (Bar Chart dọc) - Chiếm 1/3 */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-400" /> Phân bổ trạng thái
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusDistribution} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" fontSize={10} width={70} />
                <Tooltip
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #ffffff10', borderRadius: '8px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-white font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. BẢNG HIỆU SUẤT THÀNH VIÊN (Glass Table) */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Đóng góp của thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Thành viên</th>
                <th className="px-4 py-3 font-medium">Task xong</th>
                <th className="px-4 py-3 font-medium">Tiến độ</th>
                <th className="px-4 py-3 font-medium text-right">Hiệu suất</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
              {[
                { name: 'manhb7536', done: 18, total: 20, perf: '90%' },
                { name: 'Alice Nguyen', done: 12, total: 15, perf: '80%' },
                { name: 'Bob Tran', done: 5, total: 10, perf: '50%' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] text-indigo-400 border border-indigo-500/30">
                      {user.name[0]}
                    </div>
                    {user.name}
                  </td>
                  <td className="px-4 py-4">{user.done}/{user.total}</td>
                  <td className="px-4 py-4 w-1/4">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{ width: `${(user.done/user.total)*100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-indigo-400 font-mono">{user.perf}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}