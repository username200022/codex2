
import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

interface ChartDataPoint {
    month: number;
    revenue: number;
    costs: number;
    profit: number;
}

interface BreakEvenChartProps {
    data: ChartDataPoint[];
    breakEvenMonth: number | null;
    currency: string;
}

const CustomTooltip = ({ active, payload, label, currency }: any) => {
    if (active && payload && payload.length) {
        const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
        return (
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-900 dark:text-white p-3 rounded-lg border border-gray-300 dark:border-gray-600 shadow-xl">
                <p className="font-bold">{`Month ${label}`}</p>
                <p style={{ color: '#82ca9d' }}>{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
                <p style={{ color: '#ef4444' }}>{`Costs: ${formatCurrency(payload[1].value)}`}</p>
                <p className="font-semibold" style={{ color: payload[0].payload.profit >= 0 ? '#82ca9d' : '#ef4444' }}>
                    {`Profit: ${formatCurrency(payload[0].payload.profit)}`}
                </p>
            </div>
        );
    }
    return null;
};

const BreakEvenChart: React.FC<BreakEvenChartProps> = ({ data, breakEvenMonth, currency }) => {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';
    const axisColor = isDark ? "#a1a1aa" : "#4b5563";
    const gridColor = isDark ? "#404040" : "#d1d5db";
    const legendColor = isDark ? "#d4d4d8" : "#1f2937";

    const gradientOffset = () => {
        if (!breakEvenMonth || breakEvenMonth <= 0) return 0;
        if (breakEvenMonth >= 24) return 1;
        const breakEvenDataPoint = data.find(p => p.revenue >= p.costs);
        if(!breakEvenDataPoint) return 0;
        const costsAtBreakEven = breakEvenDataPoint.costs;
        const maxCost = Math.max(...data.map(p => p.costs));
        return costsAtBreakEven / maxCost;
    };

    const off = gradientOffset();
    
    return (
        <div style={{ width: '100%', height: '100%', minHeight: 400 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <XAxis dataKey="month" stroke={axisColor} unit="m" />
                    <YAxis
                        stroke={axisColor}
                        tickFormatter={(value) => new Intl.NumberFormat('en-US', {
                            notation: 'compact',
                            compactDisplay: 'short',
                        }).format(value)}
                    />
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Legend wrapperStyle={{ color: legendColor }} />

                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={off} stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset={off} stopColor="#ef4444" stopOpacity={0.3} />
                        </linearGradient>
                    </defs>

                    <Area type="monotone" dataKey="costs" stroke="none" fill="url(#splitColor)" />
                    
                    <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} name="Total Revenue" dot={false} />
                    <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Total Costs" dot={false} />

                    {breakEvenMonth !== null && breakEvenMonth <= 24 && (
                        <ReferenceLine x={breakEvenMonth} stroke="#f59e0b" strokeWidth={2} strokeDasharray="3 3">
                            <Legend>Break-even</Legend>
                        </ReferenceLine>
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BreakEvenChart;
