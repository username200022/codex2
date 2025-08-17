
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type ExpenseItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface ExpensesBarChartProps {
  data: ExpenseItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
     const currency = payload[0].payload.currency;
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-xl">
        <p className="font-bold">{label}</p>
        <p className="text-cyan-500 dark:text-cyan-400">{`Cost: ${new Intl.NumberFormat().format(payload[0].value)} ${currency}`}</p>
      </div>
    );
  }
  return null;
};

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}…`;
};

const ExpensesBarChart: React.FC<ExpensesBarChartProps> = ({ data }) => {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const axisColor = isDark ? "#a1a1aa" : "#4b5563";
    const gridColor = isDark ? "#404040" : "#d1d5db";

    const chartData = data.map(item => ({ 
        name: item.item, 
        cost: item.monthlyCost, 
        currency: item.currency 
    }));

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis type="number" stroke={axisColor} />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={130} // Increased width for labels
            stroke={axisColor}
            tick={{fontSize: 12}}
            tickFormatter={(value) => truncateText(value, 18)} // Truncate long labels
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
          <Bar dataKey="cost" name="Monthly Cost" fill="#06b6d4" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpensesBarChart;
