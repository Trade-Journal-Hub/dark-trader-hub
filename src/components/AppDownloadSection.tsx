import React from 'react';

// Professional Google Play Store Icon
const GooglePlayIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
  </svg>
);

// Professional Apple App Store Icon
const AppleIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
  </svg>
);

// Professional Lightning Icon
const LightningIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11,4H13V16L18.5,12H20.5L13,19V22H11V10L5.5,14H3.5L11,7V4Z" />
  </svg>
);

// Professional Sync Icon
const SyncIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
  </svg>
);

// Professional Chart Icon
const ChartIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z" />
  </svg>
);

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
            <div className="mr-4 text-green-500 group-hover:animate-float group-hover:text-green-400 transition-colors duration-300">
              <GooglePlayIcon className="w-10 h-10" />
            </div>
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
            <div className="mr-4 text-white group-hover:animate-float group-hover:text-gray-200 transition-colors duration-300">
              <AppleIcon className="w-10 h-10" />
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-400">Download on the</div>
              <div className="text-xl font-semibold text-white">App Store</div>
            </div>
          </a>
        </div>

        {/* App Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                <LightningIcon className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-gray-300">Optimized for speed with instant sync across all devices</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                <SyncIcon className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Real-Time Sync</h3>
            <p className="text-gray-300">Your data stays synchronized across mobile and web platforms</p>
          </div>
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                <ChartIcon className="w-12 h-12" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">Full Features</h3>
            <p className="text-gray-300">Complete trading journal functionality in your pocket</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownloadSection;