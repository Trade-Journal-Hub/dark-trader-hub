const TestimonialsSection = () => {
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

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Trusted by 50,000+ Traders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. See what successful traders say about TradeJournal Pro.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-8 p-6 bg-gradient-card rounded-xl border border-border max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">10,000+</div>
              <div className="text-sm text-muted-foreground">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Scrolling Testimonials */}
        <div className="relative">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
            <div className="flex space-x-6 animate-scroll-left hover:[animation-play-state:paused]">
              {duplicatedTestimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="flex-none w-80 p-6 rounded-xl bg-gradient-card border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-3xl mr-3">{testimonial.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-warning">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground italic text-sm leading-relaxed">"{testimonial.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TestimonialsSection;