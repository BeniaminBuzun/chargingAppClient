'use client';

import React, { useState } from 'react';

const API_BASE_URL = 'https://energymixappserver.onrender.com/';

export default function ChargingForm() {
  const [chargingHours, setChargingHours] = useState(2);
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowResult, setWindowResult] = useState(null);
  const [windowError, setWindowError] = useState(null);

  const handleFetchChargingWindow = async (e) => {
    e.preventDefault();
    setWindowLoading(true);
    setWindowError(null);
    setWindowResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/charging-window?hours=${chargingHours}`);
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

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('pl-PL', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <section className="card form-card">
      <h2 className="section-title text-center" style={{ borderBottom: 'none' }}>Zaplanuj optymalne ładowanie</h2>
      
      <form onSubmit={handleFetchChargingWindow} className="form-flex">
        <div>
          <label htmlFor="chargingHours" className="form-label">
            Czas ładowania urządzenia: <span className="highlight-text">{chargingHours} godz.</span>
          </label>
          <input
            type="range"
            id="chargingHours"
            min="1" max="6" step="1"
            value={chargingHours}
            onChange={(e) => setChargingHours(Number(e.target.value))}
            className="range-input"
          />
          <div className="range-labels">
            <span>1 godz.</span><span>6 godz.</span>
          </div>
        </div>
        <button type="submit" disabled={windowLoading} className="btn-submit">
          {windowLoading ? 'Obliczanie okna w backendzie...' : 'Znajdź najlepszy czas'}
        </button>
      </form>

      {windowError && <div className="alert-error">{windowError}</div>}

      {windowResult && (
        <div className="result-box">
          <h3 className="result-title">Wynik optymalizacji (Okienko {windowResult.windowHours}h)</h3>
          <ul className="result-list">
            <li className="result-item">
              <span className="result-label">Data i godzina rozpoczęcia:</span>
              <span className="result-value">{formatDate(windowResult.start)}</span>
            </li>
            <li className="result-item">
              <span className="result-label">Data i godzina zakończenia:</span>
              <span className="result-value">{formatDate(windowResult.end)}</span>
            </li>
            <li className="result-item result-divider">
              <span className="result-label">Średni procent udziału czystej energii:</span>
              <span className="result-highlight">{windowResult.averageCleanEnergyPercentage.toFixed(2)}%</span>
            </li>
          </ul>
        </div>
      )}
    </section>
  );
}