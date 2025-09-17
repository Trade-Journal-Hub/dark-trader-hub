import { useEffect, useState } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketTicker = () => {
  const [marketData] = useState<MarketData[]>([
    { symbol: 'NIFTY 50', price: 21845.70, change: 125.30, changePercent: 0.58 },
    { symbol: 'BANK NIFTY', price: 46128.25, change: -234.80, changePercent: -0.51 },
    { symbol: 'SENSEX', price: 72240.26, change: 89.75, changePercent: 0.12 },
    { symbol: 'BANKEX', price: 52384.15, change: -127.50, changePercent: -0.24 },
    { symbol: 'NIFTY MIDCAP', price: 51678.35, change: 234.60, changePercent: 0.46 },
    { symbol: 'NIFTY SMALLCAP', price: 16789.45, change: -76.20, changePercent: -0.45 },
    { symbol: 'INDIA VIX', price: 13.42, change: -0.68, changePercent: -4.83 },
    { symbol: 'RELIANCE', price: 2847.65, change: 45.20, changePercent: 1.61 },
    { symbol: 'TCS', price: 3654.30, change: -12.45, changePercent: -0.34 },
    { symbol: 'HDFC BANK', price: 1542.80, change: 28.90, changePercent: 1.91 },
    { symbol: 'INFY', price: 1486.25, change: 15.75, changePercent: 1.07 },
    { symbol: 'ITC', price: 456.30, change: -5.20, changePercent: -1.13 },
    { symbol: 'ICICI BANK', price: 1034.45, change: 12.35, changePercent: 1.21 },
    { symbol: 'BAJFINANCE', price: 6789.20, change: -89.45, changePercent: -1.30 }
  ]);

  return (
    <div className="bg-card border-y border-border py-4 overflow-hidden">
      <div 
        className="flex animate-slide-left whitespace-nowrap hover:[animation-play-state:paused]"
        onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
      >
        {/* Duplicate the data for seamless scrolling */}
        {[...marketData, ...marketData].map((stock, index) => (
          <div key={index} className="flex items-center mx-8 min-w-max">
            <span className="text-foreground font-medium mr-2">{stock.symbol}</span>
            <span className="text-foreground mr-2">₹{stock.price.toFixed(2)}</span>
            <span 
              className={`text-sm font-medium ${
                stock.change >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTicker;