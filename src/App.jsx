import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Users, Megaphone, Menu, X } from 'lucide-react';
import { useState } from 'react';
import AnalysisPage from './pages/AnalysisPage';
import CampaignProductsPage from './pages/CampaignProductsPage';
import CreatorsPage from './pages/CreatorsPage';
import CampaignsPage from './pages/CampaignsPage';

function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', icon: BarChart3, label: 'Analytics' },
    { path: '/campaigns', icon: Megaphone, label: 'Campaigns' },
    { path: '/products', icon: Package, label: 'TAP Products' },
    { path: '/creators', icon: Users, label: 'Creators' },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/momentiq.png"
              alt="MomentIQ Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain animate-slide-in-left hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer"
            />
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              MomentIQ
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 lg:px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive(path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<AnalysisPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/products" element={<CampaignProductsPage />} />
          <Route path="/creators" element={<CreatorsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
