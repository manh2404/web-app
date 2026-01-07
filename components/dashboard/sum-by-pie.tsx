'use client';

import { GET_METHOD } from '@/lib/req';
import { ChartPieLegend } from '@/components/dashboard/charts/pie';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { ComboboxComponent } from '@/components/combobox';
import { IComboBox } from '@/models/common.model';

export default function SumByPie() {
  const [pieData, setPieData] = useState<any[]>([]);
  const { t } = useTranslation();
  const [crStatus, setCrStatus] = useState<string>('1')

  const listStatus: IComboBox[] = ['1', '7', '30'].map((el) => {
    return { value: el, label: el === '1' ? t('this_day') : el === '7' ? t('last_7_days') : t('last_30_days') };
  });

  // useEffect(() => {
  //   GET_METHOD(`/api/order/sum?day=${crStatus}`).then((response) => {
  //     setPieData(response);
  //   });
  // }, [crStatus]);

  return pieData && pieData.length > 0 && (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t('summary_via_order')}</CardTitle>
        <CardDescription>
          <ComboboxComponent frameworks={listStatus}
                             current={crStatus}
                             cb={(val: string) => setCrStatus(val)} /></CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartPieLegend data={pieData} />
      </CardContent>
    </Card>
  );
}