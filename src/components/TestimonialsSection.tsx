import { cn } from '@/lib/utils';
import { TestimonialMarquee } from '@/components/TestimonialMarquee';
import { memo } from 'react';

const TestimonialsSection = memo(() => {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Full-time Day Trader",
      rating: 5,
      comment: "TradeJournal Pro completely transformed my trading. I've increased my win rate by 40% just by analyzing my past trades. The insights are incredible!",
      avatar: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "Options Trader",
      rating: 5,
      comment: "The real-time tracking feature is a game-changer. I can monitor all my positions across multiple brokers in one place. Highly recommended!",
      avatar: "👩‍💼"
    },
    {
      name: "Amit Patel",
      role: "Swing Trader",
      rating: 5,
      comment: "Best investment I've made for my trading career. The AI insights helped me identify my emotional biases and improve my decision making.",
      avatar: "👨‍💻"
    },
    {
      name: "Sneha Agarwal",
      role: "Portfolio Manager",
      rating: 5,
      comment: "Managing client portfolios has never been easier. The reporting features save me hours every week. My clients love the detailed analytics.",
      avatar: "👩‍💻"
    },
    {
      name: "Vikram Singh",
      role: "Crypto Trader",
      rating: 5,
      comment: "Finally, a journal that supports both stocks and crypto. The multi-exchange integration is seamless. 5 stars without a doubt!",
      avatar: "👨‍🔬"
    },
    {
      name: "Kavya Reddy",
      role: "Intraday Trader",
      rating: 5,
      comment: "The mobile app is fantastic. I can journal my trades immediately after execution. The voice notes feature is particularly useful during busy trading sessions.",
      avatar: "👩‍⚕️"
    }
  ];

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials];
    // split the testimonials into two rows
  const firstrow = testimonials.slice(0, testimonials.length / 2);
  const secondrow = testimonials.slice(testimonials.length / 2);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Trusted by 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              50,000+ Traders
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. See what successful traders say about TradeJournal Pro.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-8 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">4.9/5</div>
              <div className="text-sm text-gray-300">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-1">10,000+</div>
              <div className="text-sm text-gray-300">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-1">98%</div>
              <div className="text-sm text-gray-300">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Enhanced Scrolling Testimonials with Trading Metrics */}
        <div className="mt-16">
          <TestimonialMarquee />
        </div>
      </div>

    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';

export default TestimonialsSection;