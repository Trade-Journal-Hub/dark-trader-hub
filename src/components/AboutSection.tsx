import aboutImage from '@/assets/about-image.jpg';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <img 
              src={aboutImage} 
              alt="Professional Trading Team"
              className="rounded-2xl shadow-2xl border border-border w-full"
            />
          </div>
          
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Built by Traders, for Traders
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              TradeJournal Pro was founded by a team of professional traders who understand the frustration of 
              using inadequate tools. We've been where you are – struggling with spreadsheets, losing track of 
              trades, and missing opportunities because of poor data management.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our mission is simple: provide traders with institutional-grade tools that were previously only 
              available to hedge funds and large trading firms. Every feature is designed based on real trading 
              experience and feedback from our community of over 50,000 active traders.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-primary mb-1">50,000+</div>
                <div className="text-sm text-muted-foreground">Active Traders</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-card border border-border">
                <div className="text-2xl font-bold text-primary mb-1">₹2.5Cr+</div>
                <div className="text-sm text-muted-foreground">Daily Volume Tracked</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:shadow-glow transition-all duration-300">
                Start Your Journey
              </button>
              <button className="border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:border-primary transition-all duration-300">
                Read Our Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;