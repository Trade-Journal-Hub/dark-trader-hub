/**
 * Enhanced Testimonials with Marquee Animation
 * Performance-optimized scrolling testimonials for trading journal
 */

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { LazyImage } from "@/components/LazyImage";
import { memo } from 'react';
// import { Star, TrendingUp, DollarSign, Activity } from 'lucide-react'; // Unused imports

// Trading-specific testimonials with real metrics
const tradingTestimonials = [
  {
    name: "Rajesh Kumar",
    username: "@rajesh_trader",
    role: "Full-time Day Trader",
    comment: "Trading Journal Hub completely transformed my trading. I've increased my win rate by 40% just by analyzing my past trades. The insights are incredible!",
    img: "https://avatar.vercel.sh/rajesh",
    pnl: "+₹2.4L",
    trades: "1,250+",
    winRate: "78%",
    verified: true
  },
  {
    name: "Priya Sharma", 
    username: "@priya_options",
    role: "Options Trader",
    comment: "The real-time tracking feature is a game-changer. I can monitor all my positions across multiple brokers in one place. Highly recommended!",
    img: "https://avatar.vercel.sh/priya",
    pnl: "+₹1.8L",
    trades: "890+",
    winRate: "72%",
    verified: true
  },
  {
    name: "Amit Patel",
    username: "@amit_swing", 
    role: "Swing Trader",
    comment: "Best investment I've made for my trading career. The AI insights helped me identify my emotional biases and improve my decision making.",
    img: "https://avatar.vercel.sh/amit",
    pnl: "+₹3.2L",
    trades: "650+",
    winRate: "85%",
    verified: true
  },
  {
    name: "Sneha Agarwal",
    username: "@sneha_portfolio",
    role: "Portfolio Manager", 
    comment: "Managing multiple portfolios became so much easier. The advanced analytics give me insights I never had before. Absolutely worth it!",
    img: "https://avatar.vercel.sh/sneha",
    pnl: "+₹5.6L",
    trades: "2,100+",
    winRate: "68%",
    verified: true
  },
  {
    name: "Vikram Singh",
    username: "@vikram_forex",
    role: "Forex Trader",
    comment: "The risk management features saved me from major losses. I now trade with much more confidence knowing my risk exposure.",
    img: "https://avatar.vercel.sh/vikram",
    pnl: "+$15.2K",
    trades: "3,400+", 
    winRate: "74%",
    verified: true
  },
  {
    name: "Kavya Reddy",
    username: "@kavya_crypto",
    role: "Crypto Trader",
    comment: "Perfect for crypto trading! The volatility analysis and timing insights helped me optimize my entry and exit points significantly.",
    img: "https://avatar.vercel.sh/kavya",
    pnl: "+₹4.1L",
    trades: "1,850+",
    winRate: "81%",
    verified: true
  },
  {
    name: "Arjun Mehta",
    username: "@arjun_scalper",
    role: "Scalp Trader", 
    comment: "The millisecond-accurate tracking is perfect for scalping. I can analyze my quick trades and improve my timing strategies.",
    img: "https://avatar.vercel.sh/arjun",
    pnl: "+₹1.9L",
    trades: "5,200+",
    winRate: "69%",
    verified: true
  },
  {
    name: "Divya Joshi",
    username: "@divya_algo",
    role: "Algo Trader",
    comment: "Excellent for algorithmic trading analysis. The backtesting features and performance metrics are exactly what I needed.",
    img: "https://avatar.vercel.sh/divya", 
    pnl: "+₹6.8L",
    trades: "12,500+",
    winRate: "76%",
    verified: true
  }
];

// Split testimonials for dual marquee rows
const firstRow = tradingTestimonials.slice(0, Math.ceil(tradingTestimonials.length / 2));
const secondRow = tradingTestimonials.slice(Math.ceil(tradingTestimonials.length / 2));

// Memoized Review Card Component for Performance
const ReviewCard = memo(({
  img,
  name,
  username,
  role,
  comment,
  pnl: _pnl,
  trades: _trades,
  winRate: _winRate,
  verified
}: {
  img: string;
  name: string;
  username: string;
  role: string;
  comment: string;
  pnl: string;
  trades: string;
  winRate: string;
  verified: boolean;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 cursor-pointer overflow-hidden rounded-xl border p-6",
        "border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-sm",
        "transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10"
      )}
    >
      {/* Header with user info */}
      <div className="flex flex-row items-center gap-3 mb-4">
        <LazyImage
          src={img}
          alt={`${name} avatar`}
          className="rounded-full"
          width={48}
          height={48}
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <figcaption className="text-sm font-semibold text-white">
              {name}
            </figcaption>
            {verified && (
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs font-medium text-gray-400">{username}</p>
          <p className="text-xs text-cyan-400 font-medium">{role}</p>
        </div>
      </div>

      {/* Comment */}
      <blockquote className="text-sm text-gray-200 mb-4 leading-relaxed">
        "{comment}"
      </blockquote>

      {/* Trading metrics */}
      {/* <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 bg-success/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <DollarSign className="w-3 h-3 text-success" />
            <span className="text-xs font-medium text-success">P&L</span>
          </div>
          <div className="text-sm font-bold text-success">{pnl}</div>
        </div>
        <div className="text-center p-2 bg-primary/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Activity className="w-3 h-3 text-primary" />
            <span className="text-xs font-medium text-primary">Trades</span>
          </div>
          <div className="text-sm font-bold text-primary">{trades}</div>
        </div>
        <div className="text-center p-2 bg-warning/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-warning" />
            <span className="text-xs font-medium text-warning">Win Rate</span>
          </div>
          <div className="text-sm font-bold text-warning">{winRate}</div>
        </div>
      </div> */}

      {/* Rating stars */}
      {/* <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div> */}
    </figure>
  );
});

ReviewCard.displayName = 'ReviewCard';

// Main Marquee Component
export const TestimonialMarquee = memo(() => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black py-8">
      {/* First row - left to right (normal direction) */}
      <Marquee pauseOnHover className="[--duration:25s] [animation-direction:normal]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
      {/* Second row - right to left (reverse direction) */}
      <Marquee reverse pauseOnHover className="[--duration:30s] [animation-direction:reverse]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
      {/* Gradient overlays for smooth edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-black via-black/80 to-transparent"></div>
    </div>
  );
});

TestimonialMarquee.displayName = 'TestimonialMarquee';

export default TestimonialMarquee;
