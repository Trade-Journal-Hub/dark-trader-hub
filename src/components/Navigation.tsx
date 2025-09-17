import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="TradeJournal Pro Logo" className="h-10 w-10 hover-scale" />
              <div className="w-0.5 h-8 bg-gradient-primary"></div>
              <Link to="/" className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent hover-scale transition-transform duration-200">
                TradeJournal Pro
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/features" className="text-foreground hover:text-primary transition-colors story-link">
              Features
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors story-link">
              Dashboard
            </Link>
            <Link to="/pricing" className="text-foreground hover:text-primary transition-colors story-link">
              Pricing
            </Link>
            <Link to="/brokers" className="text-foreground hover:text-primary transition-colors story-link">
              Supported Brokers
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors story-link">
              Contact Us
            </Link>
            <Button variant="outline" size="sm">
              Log In
            </Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/features" className="block px-3 py-2 text-foreground hover:text-primary">
              Features
            </Link>
            <Link to="/dashboard" className="block px-3 py-2 text-foreground hover:text-primary">
              Dashboard
            </Link>
            <Link to="/pricing" className="block px-3 py-2 text-foreground hover:text-primary">
              Pricing
            </Link>
            <Link to="/brokers" className="block px-3 py-2 text-foreground hover:text-primary">
              Supported Brokers
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-foreground hover:text-primary">
              Contact Us
            </Link>
            <div className="flex flex-col space-y-2 p-3">
              <Button variant="outline" size="sm">
                Log In
              </Button>
              <Button className="bg-gradient-primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;