// Professional Social Media Icons
const FacebookIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="relative bg-black border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle Dim Light Effect at Top Middle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gradient-to-r from-cyan-400/8 via-purple-400/12 to-pink-400/8 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-gradient-to-r from-cyan-300/10 via-purple-300/15 to-pink-300/10 rounded-full blur-2xl animate-glow opacity-50"></div>
      </div>
      
      {/* Subtle Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/3 via-purple-900/1 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              TradeJournal Pro
            </div>
            <p className="text-gray-300 mb-6">
              The ultimate trading journal for serious traders. Track, analyze, and optimize your trading performance.
            </p>
            
            {/* Social Group Section */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-white mb-3">Connect With Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/tradejournalpro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-500 transition-all duration-300 transform hover:scale-110"
                  aria-label="Follow us on Facebook"
                >
                  <FacebookIcon className="w-6 h-6" />
                </a>
                <a 
                  href="https://twitter.com/tradejournalpro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                  aria-label="Follow us on X (Twitter)"
                >
                  <TwitterIcon className="w-6 h-6" />
                </a>
                <a 
                  href="https://instagram.com/tradejournalpro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-pink-500 transition-all duration-300 transform hover:scale-110"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon className="w-6 h-6" />
                </a>
                <a 
                  href="https://linkedin.com/company/tradejournalpro" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                  aria-label="Connect with us on LinkedIn"
                >
                  <LinkedInIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="/features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="/pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="/brokers" className="text-gray-300 hover:text-cyan-400 transition-colors">Supported Brokers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Mobile App</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Help Center</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Trading Guides</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Video Tutorials</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Community Forum</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Disclaimer</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">SEBI Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2024 TradeJournal Pro. All rights reserved. 
              <span className="ml-2">🇮🇳 Made in India for Indian Traders</span>
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>SEBI Registered</span>
              <span>•</span>
              <span>ISO 27001 Certified</span>
              <span>•</span>
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;