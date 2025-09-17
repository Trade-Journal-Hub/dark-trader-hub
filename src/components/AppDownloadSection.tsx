const AppDownloadSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          Trade Anywhere, Anytime
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Download our mobile app and take your trading journal wherever you go. 
          Available on iOS and Android with all the features you love.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          {/* Google Play Store */}
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="text-4xl mr-4 group-hover:animate-float">📱</div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Get it on</div>
              <div className="text-xl font-semibold text-foreground">Google Play</div>
            </div>
          </a>

          {/* Apple App Store */}
          <a 
            href="#" 
            className="inline-flex items-center px-8 py-4 bg-background border border-border rounded-xl hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="text-4xl mr-4 group-hover:animate-float">🍎</div>
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Download on the</div>
              <div className="text-xl font-semibold text-foreground">App Store</div>
            </div>
          </a>
        </div>

        {/* App Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Lightning Fast</h3>
            <p className="text-muted-foreground">Optimized for speed with instant sync across all devices</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Real-Time Sync</h3>
            <p className="text-muted-foreground">Your data stays synchronized across mobile and web platforms</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Full Features</h3>
            <p className="text-muted-foreground">Complete trading journal functionality in your pocket</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;