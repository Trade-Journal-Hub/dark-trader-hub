import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <img src={logo} alt="TradeJournal Pro Logo" className="h-12 w-12 hover:scale-110 hover:rotate-12 transition-all duration-500 ease-out" />
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 blur animate-pulse"></div>
              </div>
              <div className="w-0.5 h-10 bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Link to="/" className="relative text-2xl font-bold overflow-hidden">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-200 hover:from-cyan-300 hover:via-purple-300 hover:to-pink-300 transition-all duration-500">
                  TradeJournal Pro
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation - Innovative Design */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { to: "/features", label: "Features" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/pricing", label: "Pricing" },
              { to: "/brokers", label: "Brokers" },
              { to: "/contact", label: "Contact" }
            ].map((item, index) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="group relative px-3 py-2 text-gray-300 hover:text-white rounded-lg transition-all duration-300 font-medium overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">
                  {item.label}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-500 ease-out"></div>
              </Link>
            ))}
            
            <div className="flex items-center space-x-2 ml-6 pl-4 border-l border-white/10">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative group text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-cyan-400/50 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button className="relative group bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 rounded-xl overflow-hidden">
                <span className="relative z-10 font-semibold">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-400 opacity-0 group-hover:opacity-20 blur transition-opacity duration-500"></div>
              </Button>
            </div>
          </div>

          {/* Mobile menu button - Enhanced */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="relative z-10">
                {isMenuOpen ? (
                  <X size={24} className="rotate-0 group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu size={24} className="group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Enhanced */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {[
              { to: "/features", label: "Features" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/pricing", label: "Pricing" },
              { to: "/brokers", label: "Brokers" },
              { to: "/contact", label: "Contact" }
            ].map((item, index) => (
              <Link 
                key={item.to}
                to={item.to} 
                className="group flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 font-medium"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  {item.label}
                </span>
                <div className="ml-auto w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-6 transition-all duration-500"></div>
              </Link>
            ))}
            
            <div className="flex flex-col space-y-3 pt-6 border-t border-white/10 mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative group text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-cyan-400/50 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Log In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button className="relative group bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-xl rounded-xl overflow-hidden">
                <span className="relative z-10 font-semibold">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;