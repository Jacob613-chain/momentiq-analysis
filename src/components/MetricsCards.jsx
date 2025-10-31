import React from 'react';
import { TrendingUp, TrendingDown, Users, Package, DollarSign, BarChart3 } from 'lucide-react';

const MetricCard = ({ title, value, growth, icon: Icon, color, prefix = '', suffix = '' }) => {
  const hasGrowth = growth !== null && growth !== undefined;
  const isPositive = growth > 0;
  const isNegative = growth < 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {hasGrowth && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
            isPositive ? 'bg-green-100 text-green-700' : 
            isNegative ? 'bg-red-100 text-red-700' : 
            'bg-gray-100 text-gray-700'
          }`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            <span>{isPositive ? '+' : ''}{growth.toLocaleString()}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </p>
    </div>
  );
};

const MetricsCards = ({ latestMetrics }) => {
  if (!latestMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total Creators"
        value={latestMetrics.total_creators}
        growth={latestMetrics.creators_growth}
        icon={Users}
        color="bg-gradient-to-br from-blue-500 to-blue-600"
      />
      <MetricCard
        title="Products Substituted"
        value={latestMetrics.total_products_substituted}
        growth={latestMetrics.products_substituted_growth}
        icon={Package}
        color="bg-gradient-to-br from-purple-500 to-purple-600"
      />
      <MetricCard
        title="Avg Products per Creator"
        value={latestMetrics.avg_products_per_creator.toFixed(2)}
        icon={BarChart3}
        color="bg-gradient-to-br from-indigo-500 to-indigo-600"
      />
      <MetricCard
        title="GMV Generated"
        value={latestMetrics.gmv_generated.toFixed(2)}
        growth={latestMetrics.gmv_growth}
        icon={DollarSign}
        color="bg-gradient-to-br from-green-500 to-green-600"
        prefix="$"
      />
    </div>
  );
};

export default MetricsCards;

