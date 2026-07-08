'use client';

import React, { useState, useEffect } from 'react';
import DailyMixChart from '../components/DailyMixChart';
import ChargingForm from '../components/ChargingForm';

// --- KONFIGURACJA MAPOWANIA ŹRÓDEŁ --- //
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

export default function App() {
  const [mixData, setMixData] = useState(null);
  const [mixLoading, setMixLoading] = useState(true);
  const [mixError, setMixError] = useState(null);

  // POBIERANIE MIKSU ENERGETYCZNEGO
  useEffect(() => {
    async function fetchEnergyMix() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/energy-mix`);
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
    <main className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Panel Miksu Energetycznego</h1>
          <p className="text-gray-500 mt-2">Dane pobierane w czasie rzeczywistym z systemu backendowego</p>
        </header>

        {/* SEKCJA WYKRESÓW */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Prognoza na najbliższe dni</h2>
          
          {mixLoading && <div className="text-center py-10 text-gray-500">Ładowanie wykresów miksu energetycznego...</div>}
          {mixError && <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center border border-red-200">{mixError}</div>}

          {mixData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* SEKCJA FORMULARZA (WYDZIELONY KOMPONENT) */}
        <ChargingForm />
        
      </div>
    </main>
  );
}