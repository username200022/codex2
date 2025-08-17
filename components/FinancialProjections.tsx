import React, { useState, useMemo, useEffect } from 'react';
import { type FinancialData, type StaffItem, type MarketingItem, type FinancialDriver, type CustomCostItem } from '../types';
import BreakEvenChart from './charts/BreakEvenChart';
import StaffCostModal from './modals/StaffCostModal';
import MarketingCostModal from './modals/MarketingCostModal';
import EditableCostControl from './EditableCostControl';

interface FinancialProjectionsProps {
    data: FinancialData;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(value);
};

const MetricCard: React.FC<{ title: string; value: string; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-white dark:bg-gray-800/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg flex flex-col justify-center items-center gap-2 text-center ${className}`}>
        <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{value}</p>
    </div>
);

const DetailControl: React.FC<{ label: string; value: number; currency: string; onDetailsClick: () => void; isDisabled?: boolean }> = ({ label, value, currency, onDetailsClick, isDisabled }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-baseline">
            <label className="font-semibold text-gray-700 dark:text-gray-300 truncate" title={label}>{label}</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-400">{formatCurrency(value, currency)}</span>
        </div>
        <button 
          onClick={onDetailsClick} 
          disabled={isDisabled}
          className="w-full py-2 px-4 rounded-lg bg-gray-200/70 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Details
        </button>
    </div>
);


const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ data }) => {
    // --- NEW STATE for non-linear projections ---
    const [startingMonthlyRevenue, setStartingMonthlyRevenue] = useState(10000);
    const [monthlyGrowthRate, setMonthlyGrowthRate] = useState(5); // In percent
    const [cogsPercentage, setCogsPercentage] = useState(30); // Cost of Goods Sold as % of Revenue
    
    // State to hold the current values of the dynamic drivers
    const [driverValues, setDriverValues] = useState<Record<string, number>>({});
    
    // States for complex modal data
    const [staffItems, setStaffItems] = useState<StaffItem[]>([]);
    const [marketingItems, setMarketingItems] = useState<MarketingItem[]>([]);
    const [customCosts, setCustomCosts] = useState<CustomCostItem[]>([]);
    
    // States to control modal visibility
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
    const [isMarketingModalOpen, setIsMarketingModalOpen] = useState(false);

    useEffect(() => {
        // Initialize the values for all drivers when data changes
        const initialDriverValues: Record<string, number> = {};
        data.drivers.forEach(driver => {
            initialDriverValues[driver.name] = driver.initialCost;

            // Pre-populate detailed modals based on driver type
            if (driver.type === 'staff') {
                setStaffItems([{ id: `initial-${driver.name}`, role: 'Initial Staff', headcount: 1, salary: driver.initialCost }]);
            }
            if (driver.type === 'marketing') {
                setMarketingItems([{ id: `initial-${driver.name}`, channel: 'Initial Marketing', cost: driver.initialCost }]);
            }
        });
        setDriverValues(initialDriverValues);
        setCustomCosts([]); // Reset custom costs
        
        // Reset starting revenue based on new total expenses
        const newTotalExpenses = data.drivers.reduce((sum, d) => sum + d.initialCost, 0);
        setStartingMonthlyRevenue(Math.max(newTotalExpenses * 1.5, 10000));

    }, [data]);

    // Update driverValues when detailed modals are used
    useEffect(() => {
        const staffDriver = data.drivers.find(d => d.type === 'staff');
        if (staffDriver) {
            const totalStaffCost = staffItems.reduce((sum, item) => sum + (item.headcount * item.salary), 0);
            setDriverValues(prev => ({...prev, [staffDriver.name]: totalStaffCost }));
        }
    }, [staffItems, data.drivers]);

    useEffect(() => {
        const marketingDriver = data.drivers.find(d => d.type === 'marketing');
        if (marketingDriver) {
            const totalMarketingCost = marketingItems.reduce((sum, item) => sum + item.cost, 0);
            setDriverValues(prev => ({...prev, [marketingDriver.name]: totalMarketingCost }));
        }
    }, [marketingItems, data.drivers]);

    const projectionData = useMemo(() => {
        const totalCustomCosts = customCosts.reduce((sum, item) => sum + item.monthlyCost, 0);
        const fixedMonthlyExpenses = Object.values(driverValues).reduce((sum, val) => sum + val, 0) + totalCustomCosts;
        
        const chartData = [];
        let cumulativeRevenue = 0;
        let cumulativeCosts = data.totalInitialCapital;
        let breakEvenMonth: number | null = null;

        for (let month = 0; month <= 24; month++) {
            let profitForMonth = 0;
            if (month > 0) {
                const currentMonthRevenue = startingMonthlyRevenue * Math.pow(1 + monthlyGrowthRate / 100, month - 1);
                const cogsForMonth = currentMonthRevenue * (cogsPercentage / 100);
                const totalExpensesForMonth = fixedMonthlyExpenses + cogsForMonth;
                profitForMonth = currentMonthRevenue - totalExpensesForMonth;

                cumulativeRevenue += currentMonthRevenue;
                cumulativeCosts += totalExpensesForMonth;
            }

            chartData.push({
                month: month,
                revenue: cumulativeRevenue,
                costs: cumulativeCosts,
                profit: cumulativeRevenue - cumulativeCosts,
            });

            if (breakEvenMonth === null && cumulativeRevenue > cumulativeCosts) {
                 const prevProfit = chartData[month -1]?.profit ?? -data.totalInitialCapital;
                 // Use profitForMonth, which is the net cash flow for this specific month
                 const monthlyNet = profitForMonth;
                 if (monthlyNet > 0) {
                     breakEvenMonth = month - 1 + (-prevProfit / monthlyNet);
                 }
            }
        }
        
        const profitAt12Months = chartData[12].profit;

        return { chartData, breakEvenMonth, profitAt12Months };

    }, [data.totalInitialCapital, startingMonthlyRevenue, monthlyGrowthRate, cogsPercentage, driverValues, customCosts]);


    const renderDriverControl = (driver: FinancialDriver) => {
        const value = driverValues[driver.name] ?? 0;

        switch(driver.type) {
            case 'staff':
                return <DetailControl key={driver.name} label={driver.name} value={value} currency={data.currency} onDetailsClick={() => setIsStaffModalOpen(true)} />;
            case 'marketing':
                 return <DetailControl key={driver.name} label={driver.name} value={value} currency={data.currency} onDetailsClick={() => setIsMarketingModalOpen(true)} />;
            case 'rent':
            case 'generic':
                 return <EditableCostControl key={driver.name} label={driver.name} value={value} currency={data.currency} onSave={(newValue) => setDriverValues(prev => ({...prev, [driver.name]: newValue}))} />;
            default:
                return null;
        }
    };

    const handleAddCustomCost = () => {
        setCustomCosts(prev => [...prev, { id: `custom-${Date.now()}`, name: 'New Expense', monthlyCost: 100 }]);
    };
    
    const handleUpdateCustomCost = (id: string, field: 'name' | 'monthlyCost', value: string | number) => {
        setCustomCosts(prev =>
            prev.map(cost => (cost.id === id ? { ...cost, [field]: value } : cost))
        );
    };
    
    const handleRemoveCustomCost = (id: string) => {
        setCustomCosts(prev => prev.filter(cost => cost.id !== id));
    };


    return (
        <div className="p-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <MetricCard 
                    title="Months to Profitability"
                    value={projectionData.breakEvenMonth && projectionData.breakEvenMonth > 0 && projectionData.breakEvenMonth <= 24 ? projectionData.breakEvenMonth.toFixed(1) : 'N/A'}
                />
                 <MetricCard 
                    title="Profit at 12 Months"
                    value={formatCurrency(projectionData.profitAt12Months, data.currency)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Controls Panel */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-800/70 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">Scenario Builder</h3>
                    
                    {/* Revenue Controls */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="font-semibold text-gray-700 dark:text-gray-300">Starting Monthly Revenue</label>
                            <span className="font-mono text-cyan-600 dark:text-cyan-400">{formatCurrency(startingMonthlyRevenue, data.currency)}</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max={Math.max(data.totalRecurringExpenses * 5, 50000)}
                            step="100"
                            value={startingMonthlyRevenue}
                            onChange={(e) => setStartingMonthlyRevenue(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="font-semibold text-gray-700 dark:text-gray-300">Monthly Growth Rate</label>
                            <span className="font-mono text-cyan-600 dark:text-cyan-400">{monthlyGrowthRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={monthlyGrowthRate}
                            onChange={(e) => setMonthlyGrowthRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                    
                    {/* Variable Cost (COGS) Control */}
                    <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-baseline">
                            <label className="font-semibold text-gray-700 dark:text-gray-300">Cost of Goods Sold</label>
                            <span className="font-mono text-cyan-600 dark:text-cyan-400">{cogsPercentage}% of Revenue</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="90"
                            step="1"
                            value={cogsPercentage}
                            onChange={(e) => setCogsPercentage(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>

                    {/* Fixed Cost Controls */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-6">
                        <h4 className="text-lg font-bold text-gray-600 dark:text-gray-400 text-center">Fixed Monthly Expenses</h4>
                        {data.drivers.map(driver => renderDriverControl(driver))}
                    </div>

                    {/* Custom Costs */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                         <h4 className="text-lg font-bold text-gray-600 dark:text-gray-400 text-center">Custom Monthly Expenses</h4>
                         {customCosts.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-100 dark:bg-gray-900/50 p-2 rounded-lg">
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleUpdateCustomCost(item.id, 'name', e.target.value)}
                                    placeholder="Expense Name"
                                    className="col-span-6 bg-transparent focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1 text-gray-800 dark:text-gray-200"
                                />
                                <div className="col-span-5 flex items-center justify-end">
                                    <span className="text-gray-400 mr-1">{data.currency}</span>
                                    <input
                                        type="number"
                                        value={item.monthlyCost}
                                        onChange={(e) => handleUpdateCustomCost(item.id, 'monthlyCost', Number(e.target.value))}
                                        min="0"
                                        className="bg-transparent focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded p-1 text-right w-24 text-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <button onClick={() => handleRemoveCustomCost(item.id)} className="col-span-1 text-gray-400 hover:text-red-500 flex justify-center items-center">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                         ))}
                         <button
                            onClick={handleAddCustomCost}
                            className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
                        >
                            + Add Custom Cost
                        </button>
                    </div>
                </div>
                
                {/* Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/70 p-4 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-lg">
                     <BreakEvenChart 
                        data={projectionData.chartData} 
                        breakEvenMonth={projectionData.breakEvenMonth}
                        currency={data.currency}
                     />
                </div>
            </div>
            
            {/* Modals */}
            <StaffCostModal 
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
                staffItems={staffItems}
                onUpdate={setStaffItems}
                currency={data.currency}
            />
            <MarketingCostModal
                isOpen={isMarketingModalOpen}
                onClose={() => setIsMarketingModalOpen(false)}
                marketingItems={marketingItems}
                onUpdate={setMarketingItems}
                currency={data.currency}
            />
        </div>
    );
};

export default FinancialProjections;