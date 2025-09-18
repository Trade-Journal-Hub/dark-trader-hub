const AppDownloadSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Trade Anywhere, 
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Anytime
          </span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Download our mobile app and take your trading journal wherever you go. 
          Available on iOS and Android with all the features you love.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          {/* Google Play Store */}
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="text-4xl mr-4 group-hover:animate-float">📱</div>
            <div className="text-left">
              <div className="text-sm text-gray-400">Get it on</div>
              <div className="text-xl font-semibold text-white">Google Play</div>
            </div>
          </a>

          {/* Apple App Store */}
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:border-cyan-400/50 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="text-4xl mr-4 group-hover:animate-float">🍎</div>
            <div className="text-left">
              <div className="text-sm text-gray-400">Download on the</div>
              <div className="text-xl font-semibold text-white">App Store</div>
            </div>
          </a>
        </div>

        {/* App Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-gray-300">Optimized for speed with instant sync across all devices</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Real-Time Sync</h3>
            <p className="text-gray-300">Your data stays synchronized across mobile and web platforms</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-white">Full Features</h3>
            <p className="text-gray-300">Complete trading journal functionality in your pocket</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;