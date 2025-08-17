
import React from 'react';
import { type FinancialData } from '../types';
import CapitalPieChart from './charts/PieChart';
import ExpensesBarChart from './charts/BarChart';

interface FinancialDashboardProps {
  data: FinancialData;
}

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const MetricCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => (
  <div className={`bg-white dark:bg-gray-800/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg flex flex-col justify-center items-center gap-2 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{value}</p>
  </div>
);

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ data }) => {
  return (
    <div className="space-y-6 p-2">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard 
          title="Total Initial Capital" 
          value={formatCurrency(data.totalInitialCapital, data.currency)} 
        />
        <MetricCard 
          title="Total Monthly Expenses" 
          value={formatCurrency(data.totalRecurringExpenses, data.currency)}
        />
      </div>

      {/* Charts - Now stacked vertically for better clarity */}
      <div className="grid grid-cols-1 gap-6">
        {data.initialCapital.length > 0 && (
          <div className="bg-white dark:bg-gray-800/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Initial Capital Breakdown</h3>
            <CapitalPieChart data={data.initialCapital} />
          </div>
        )}
        {data.recurringExpenses.length > 0 && (
          <div className="bg-white dark:bg-gray-800/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">Recurring Monthly Expenses</h3>
            <ExpensesBarChart data={data.recurringExpenses} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;
