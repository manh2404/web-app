import React from 'react';
import { Briefcase, Calendar, Clock, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SystemInfo() {
  return (
    <Card className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-white/10 shadow-lg">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-green-400" /> Trạng thái hệ thống
        </h3>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Phòng ban</p>
            <p className="text-sm font-medium text-white">IT Department</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-zinc-500 font-bold">Ngày tham gia</p>
            <p className="text-sm font-medium text-white">24/12/2025</p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5 mt-2">
          <p className="text-xs text-zinc-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Login cuối: Hôm nay, 09:30 AM
          </p>
        </div>

      </CardContent>
    </Card>
  );
}