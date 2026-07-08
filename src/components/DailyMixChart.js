'use client';

import React from 'react';

export default function DailyMixChart({ dayLabel, chartData, totalClean }) {
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercent = 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
      <h3 className="text-xl font-medium">{dayLabel}</h3>
      
      {/* Udział czystej energii */}
      <div className="mt-2 bg-green-50 text-green-700 px-4 py-1 rounded-full font-semibold text-sm">
        Czysta energia: {totalClean.toFixed(1)}%
      </div>

      {/* Wykres Kołowy (Natywny SVG) */}
      <div className="w-full h-48 mt-6 mb-2 flex justify-center relative">
        {/* Obracamy SVG o -90 stopni, aby pierwszy element zaczynał się na godzinie 12:00 */}
        <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 drop-shadow-sm">
          {chartData.map((entry, index) => {
            if (entry.value === 0) return null;

            const percent = totalValue > 0 ? (entry.value / totalValue) * 100 : 0;
            
            // strokeDasharray definiuje długość zamalowanego odcinka i pustej przestrzeni reszty obwodu (z 100)
            const strokeDasharray = `${percent} ${100 - percent}`;
            // strokeDashoffset przesuwa początek rysowania o sumę poprzednich wartości
            const strokeDashoffset = -cumulativePercent;
            
            cumulativePercent += percent;

            return (
              <circle
                key={index}
                r="15.9155" // Promień dający obwód równy dokładnie 100 (2 * PI * 15.9155 = 100)
                cx="16"
                cy="16"
                fill="transparent"
                stroke={entry.color}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-in-out hover:opacity-80 cursor-pointer"
              >
                {/* Natywny tooltip wyświetlany po najechaniu myszką */}
                <title>{entry.name}: {entry.value.toFixed(1)}%</title>
              </circle>
            );
          })}
        </svg>
      </div>

      {/* Ręcznie stworzona Legenda */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center text-xs text-gray-600">
            <span 
              className="w-3 h-3 rounded-full mr-1.5 inline-block shadow-sm" 
              style={{ backgroundColor: entry.color }}
            ></span>
            <span className="font-medium">{entry.name}</span>
            <span className="ml-1 text-gray-400">({entry.value.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}