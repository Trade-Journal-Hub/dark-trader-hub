import aboutImage from '@/assets/about-image.jpg';

const AboutSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Built by Traders, 
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                for Traders
              </span>
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              TradeJournal Pro was founded by a team of professional traders who understand the frustration of 
              using inadequate tools. We've been where you are – struggling with spreadsheets, losing track of 
              trades, and missing opportunities because of poor data management.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              Our mission is simple: provide traders with institutional-grade tools that were previously only 
              available to hedge funds and large trading firms. Every feature is designed based on real trading 
              experience and feedback from our community of over 50,000 active traders.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl font-bold text-cyan-400 mb-1">50,000+</div>
                <div className="text-sm text-gray-300">Active Traders</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-2xl font-bold text-purple-400 mb-1">₹2.5Cr+</div>
                <div className="text-sm text-gray-300">Daily Volume Tracked</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Journey
              </button>
              <button className="border-2 border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black backdrop-blur-sm transition-all duration-300">
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