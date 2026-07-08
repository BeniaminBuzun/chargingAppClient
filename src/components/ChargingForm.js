'use client';

import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function ChargingForm() {
  const [chargingHours, setChargingHours] = useState(2);
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowResult, setWindowResult] = useState(null);
  const [windowError, setWindowError] = useState(null);

  // Funkcja wysyłająca zapytanie do backendu
  const handleFetchChargingWindow = async (e) => {
    e.preventDefault();
    setWindowLoading(true);
    setWindowError(null);
    setWindowResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/charging-window?hours=${chargingHours}`);
      if (!response.ok) throw new Error(`Błąd serwera: ${response.status}`);
      const data = await response.json();
      setWindowResult(data);
    } catch (err) {
      console.error(err);
      setWindowError('Nie udało się obliczyć optymalnego okna ładowania.');
    } finally {
      setWindowLoading(false);
    }
  };

  // Helper do formatowania daty
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center">Zaplanuj optymalne ładowanie</h2>
      
      <form onSubmit={handleFetchChargingWindow} className="flex flex-col space-y-6">
        <div>
          <label htmlFor="chargingHours" className="block text-sm font-medium text-gray-700 mb-2">
            Czas ładowania urządzenia: <span className="font-bold text-blue-600">{chargingHours} godz.</span>
          </label>
          <input
            type="range"
            id="chargingHours"
            min="1" max="6" step="1"
            value={chargingHours}
            onChange={(e) => setChargingHours(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 godz.</span><span>6 godz.</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={windowLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 flex justify-center items-center"
        >
          {windowLoading ? 'Obliczanie okna w backendzie...' : 'Znajdź najlepszy czas'}
        </button>
      </form>

      {windowError && (
        <div className="mt-6 bg-red-50 text-red-700 p-4 rounded-xl text-center border border-red-200">
          {windowError}
        </div>
      )}

      {/* WYNIK Z BACKENDU */}
      {windowResult && (
        <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Wynik optymalizacji (Okienko {windowResult.windowHours}h)</h3>
          <ul className="space-y-3">
            <li className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-600">Data i godzina rozpoczęcia:</span>
              <span className="font-semibold text-gray-900">{formatDate(windowResult.start)}</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:justify-between">
              <span className="text-gray-600">Data i godzina zakończenia:</span>
              <span className="font-semibold text-gray-900">{formatDate(windowResult.end)}</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:justify-between pt-2 border-t border-blue-200 items-baseline">
              <span className="text-gray-600">Średni procent udziału czystej energii:</span>
              <span className="font-bold text-green-600 text-xl">{windowResult.averageCleanEnergyPercentage.toFixed(2)}%</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}