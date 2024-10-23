"use client"

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const LandingTrading: React.FC = () => {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      height: "610",
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "America/New_York",
      theme: resolvedTheme === 'dark' ? 'dark' : 'light',
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com"
    });

    const container = document.getElementById('tradingview-widget');
    if (container) {
      container.innerHTML = ''; // Clear previous content
      container.appendChild(script);
    }

    return () => {
      if (container && container.contains(script)) {
        container.removeChild(script);
      }
    };
  }, [resolvedTheme]); // Use resolvedTheme instead of theme

  return (
    <div className="tradingview-widget-container h-full w-full">
      <div id="tradingview-widget" className="h-[calc(100%-32px)] w-full"></div>
    </div>
  );
};

export default LandingTrading;