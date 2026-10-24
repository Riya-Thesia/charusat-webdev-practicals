import React, { useState } from 'react';

// Practical 8 Supplementary Problem: Heavy Third-Party / Analytics Chart Component
// This component is lazy-loaded on-demand only when requested by the user.
const AnalyticsChart = () => {
  const [selectedMetric, setSelectedMetric] = useState('completion');

  const chartData = [
    { label: 'Mon', completed: 8, pending: 3, latencyMs: 12 },
    { label: 'Tue', completed: 14, pending: 5, latencyMs: 8 },
    { label: 'Wed', completed: 18, pending: 2, latencyMs: 5 },
    { label: 'Thu', completed: 22, pending: 4, latencyMs: 6 },
    { label: 'Fri', completed: 30, pending: 1, latencyMs: 4 },
    { label: 'Sat', completed: 12, pending: 2, latencyMs: 5 },
    { label: 'Sun', completed: 16, pending: 0, latencyMs: 4 }
  ];

  const maxVal = 35;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e1e2e 0%, #181825 100%)',
      borderRadius: '16px',
      padding: '2rem',
      color: '#cdd6f4',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      marginTop: '2rem',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: '#f5e0dc', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📊</span> Practical 8 & 9 Performance Analytics
          </h3>
          <p style={{ margin: '0.3rem 0 0 0', color: '#a6adc8', fontSize: '0.9rem' }}>
            Heavy Chart Module (Dynamically Code-Split & Lazy Loaded on Demand)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setSelectedMetric('completion')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedMetric === 'completion' ? '#89b4fa' : '#313244',
              color: selectedMetric === 'completion' ? '#11111b' : '#cdd6f4',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Task Velocity
          </button>
          <button
            onClick={() => setSelectedMetric('latency')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedMetric === 'latency' ? '#a6e3a1' : '#313244',
              color: selectedMetric === 'latency' ? '#11111b' : '#cdd6f4',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            API Latency (ms)
          </button>
        </div>
      </div>

      {/* SVG Data Visualization Bar Chart */}
      <div style={{ background: '#11111b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #313244' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '220px', gap: '1rem', paddingTop: '1rem' }}>
          {chartData.map((item, index) => {
            const barHeight = selectedMetric === 'completion'
              ? (item.completed / maxVal) * 100
              : (item.latencyMs / 15) * 100;

            return (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.75rem', color: '#a6adc8', marginBottom: '0.4rem', fontWeight: '600' }}>
                  {selectedMetric === 'completion' ? item.completed : `${item.latencyMs}ms`}
                </div>
                <div style={{
                  width: '70%',
                  maxWidth: '36px',
                  height: `${barHeight}%`,
                  background: selectedMetric === 'completion'
                    ? 'linear-gradient(180deg, #89b4fa 0%, #b4befe 100%)'
                    : 'linear-gradient(180deg, #a6e3a1 0%, #94e2d5 100%)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease',
                  boxShadow: '0 4px 12px rgba(137, 180, 250, 0.2)'
                }} />
                <div style={{ fontSize: '0.8rem', color: '#cdd6f4', marginTop: '0.6rem', fontWeight: '500' }}>
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.85rem', color: '#a6adc8' }}>
        <span>⚡ Dynamic Chunk: <code>AnalyticsChart.chunk.js</code></span>
        <span>✅ Lazy Loaded with React.lazy() & Suspense</span>
      </div>
    </div>
  );
};

export default AnalyticsChart;
