'use client';

import React from 'react';

export default function DailyMixChart({ dayLabel, chartData, totalClean }) {
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  return (
    <div className="card card-center">
      <h3 className="card-title">{dayLabel}</h3>
      
      <div className="badge-clean">
        Czysta energia: {totalClean.toFixed(1)}%
      </div>

      <div className="chart-wrapper">
        <svg viewBox="-6 -6 44 44" className="chart-svg">
          {chartData.map((entry, index) => {
            if (entry.value === 0) return null;

            const percent = totalValue > 0 ? (entry.value / totalValue) * 100 : 0;
            const strokeDasharray = `${percent} ${100 - percent}`;
            const strokeDashoffset = -cumulativePercent;
            
            cumulativePercent += percent;

            return (
              <circle
                key={index}
                r="15.9155"
                cx="16"
                cy="16"
                fill="transparent"
                stroke={entry.color}
                strokeWidth="6"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="chart-circle"
              >
                <title>{entry.name}: {entry.value.toFixed(1)}%</title>
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="legend-container">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
            <span style={{ fontWeight: 500 }}>{entry.name}</span>
            <span style={{ marginLeft: '4px', color: '#9ca3af' }}>({entry.value.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}