'use client';
import './global.css';

import React, { useState, useEffect } from 'react';
import DailyMixChart from '../components/DailyMixChart';
import ChargingForm from '../components/ChargingForm';

const SOURCE_CONFIG = {
  wiatr: { color: '#10b981', isClean: true },
  wind: { color: '#10b981', isClean: true },
  słońce: { color: '#f59e0b', isClean: true },
  solar: { color: '#f59e0b', isClean: true },
  oze: { color: '#059669', isClean: true },
  węgiel: { color: '#374151', isClean: false },
  coal: { color: '#374151', isClean: false },
  gaz: { color: '#6b7280', isClean: false },
  gas: { color: '#6b7280', isClean: false },
};

const getColor = (source) => SOURCE_CONFIG[source.toLowerCase()]?.color || '#9ca3af';
const isClean = (source) => SOURCE_CONFIG[source.toLowerCase()]?.isClean || false;

const API_BASE_URL = 'https://energymixappserver.onrender.com';

export default function EnergyMixApp() {
  const [mixData, setMixData] = useState(null);
  const [mixLoading, setMixLoading] = useState(true);
  const [mixError, setMixError] = useState(null);

  useEffect(() => {
    async function fetchEnergyMix() {
      try {
        const response = await fetch(`${API_BASE_URL}/energy-mix`);
        if (!response.ok) throw new Error(`Błąd serwera: ${response.status}`);
        const data = await response.json();
        setMixData(data);
      } catch (err) {
        console.error(err);
        setMixError('Nie udało się pobrać danych o miksie energetycznym.');
      } finally {
        setMixLoading(false);
      }
    }
    fetchEnergyMix();
  }, []);

  const dayLabels = ['Dzisiaj', 'Jutro', 'Pojutrze'];

  return (
    <main className="app-main">
      <div className="content-wrapper">
        
        <header className="text-center">
          <h1 className="main-title">Panel Miksu Energetycznego</h1>
          <p className="sub-title">Dane pobierane w czasie rzeczywistym z systemu backendowego</p>
        </header>

        <section>
          <h2 className="section-title">Prognoza na najbliższe dni</h2>
          
          {mixLoading && <div className="loading-text">Ładowanie wykresów miksu energetycznego...</div>}
          {mixError && <div className="alert-error">{mixError}</div>}

          {mixData && (
            <div className="grid-container">
              {mixData.days.map((daySummary, index) => {
                const chartData = Object.entries(daySummary.sources).map(([name, value]) => ({
                  name,
                  value,
                  color: getColor(name),
                  isClean: isClean(name),
                }));

                const totalClean = chartData
                  .filter((item) => item.isClean)
                  .reduce((sum, item) => sum + item.value, 0);

                return (
                  <DailyMixChart 
                    key={index} 
                    dayLabel={dayLabels[index] || `Dzień ${index + 1}`} 
                    chartData={chartData} 
                    totalClean={totalClean} 
                  />
                );
              })}
            </div>
          )}
        </section>

        <ChargingForm />
        
      </div>
    </main>
  );
}