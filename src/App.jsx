import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Users } from 'lucide-react';
import AnalysisPage from './pages/AnalysisPage';
import CampaignProductsPage from './pages/CampaignProductsPage';
import CreatorsPage from './pages/CreatorsPage';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="/momentiq.png"
              alt="MomentIQ Logo"
              className="h-10 w-10 object-contain animate-slide-in-left hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer"
            />
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              MomentIQ
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isActive('/products')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-5 h-5" />
              TAP Products
            </Link>
            <Link
              to="/creators"
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isActive('/creators')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Creators
            </Link>
          </div>
        </div>
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
          <Route path="/products" element={<CampaignProductsPage />} />
          <Route path="/creators" element={<CreatorsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
