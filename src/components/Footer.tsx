const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4">
              TradeJournal Pro
            </div>
            <p className="text-gray-300 mb-4">
              The ultimate trading journal for serious traders. Track, analyze, and optimize your trading performance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-xl">📘</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-xl">📸</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <span className="text-xl">💼</span>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#brokers" className="text-gray-300 hover:text-cyan-400 transition-colors">Supported Brokers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">API Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Mobile App</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Help Center</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact Us</a></li>
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