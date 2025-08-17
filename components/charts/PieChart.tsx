
import React, { useState, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts';
import { type CapitalItem } from '../../types';
import { useTheme } from '../../hooks/useTheme';

interface CapitalPieChartProps {
  data: CapitalItem[];
}

const COLORS = ['#06b6d4', '#2563eb', '#16a34a', '#c026d3', '#db2777', '#ca8a04', '#6d28d9'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { fullName, value, currency } = payload[0].payload;
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-xl">
        <p className="font-bold">{`${fullName}`}</p>
        <p className="text-cyan-500 dark:text-cyan-400">{`${new Intl.NumberFormat().format(value)} ${currency}`}</p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g style={{ filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.4))' }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const CapitalPieChart: React.FC<CapitalPieChartProps> = ({ data }) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';
  const [activeIndex, setActiveIndex] = useState(-1);

  const chartData = useMemo(() => data.map(item => ({ 
      name: item.item, // Name for active shape
      fullName: item.item, // Full name for the legend
      value: item.cost, 
      currency: item.currency 
  })), [data]);

  const totalValue = useMemo(() => chartData.reduce((sum, entry) => sum + entry.value, 0), [chartData]);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);

  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);
  
  const PieWithAnyProps = Pie as any;

  return (
    <div className="flex flex-col md:flex-row items-center -mx-4 w-full h-[350px]">
        {/* Chart Section */}
        <div className="w-full md:w-2/3 h-full">
            <ResponsiveContainer>
                <PieChart>
                  <PieWithAnyProps
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false} // Disable default labels
                    outerRadius={"85%"}
                    innerRadius={0}
                    fill="#8884d8"
                    dataKey="value"
                    stroke={isDark ? "#27272a" : "#ffffff"}
                    strokeWidth={3}
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {chartData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </PieWithAnyProps>
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
        {/* Legend Section */}
        <div className="w-full md:w-1/3 h-full overflow-y-auto pr-4 space-y-2">
            {chartData.map((item, index) => (
                 <div
                    key={`item-${index}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(-1)}
                    className={`p-3 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 ${
                        activeIndex === index
                        ? 'bg-gray-200/50 dark:bg-gray-700/50 scale-105 shadow-md'
                        : 'bg-transparent'
                    }`}
                >
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate" title={item.fullName}>{item.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.value.toLocaleString()} {item.currency}</p>
                    </div>
                    <div className="font-bold text-gray-700 dark:text-gray-300">
                        {`${((item.value / totalValue) * 100).toFixed(1)}%`}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default CapitalPieChart;