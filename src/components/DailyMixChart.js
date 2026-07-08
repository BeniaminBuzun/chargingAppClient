'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DailyMixChart({ dayLabel, chartData, totalClean }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <h3 className="text-xl font-medium">{dayLabel}</h3>
      
      {/* Udział czystej energii */}
      <div className="mt-2 bg-green-50 text-green-700 px-4 py-1 rounded-full font-semibold text-sm">
        Czysta energia: {totalClean.toFixed(1)}%
      </div>

      {/* Wykres Kołowy */}
      <div className="w-full h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}