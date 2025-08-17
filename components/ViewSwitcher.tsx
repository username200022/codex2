
import React from 'react';

type View = 'flowchart' | 'text' | 'dashboard' | 'details' | 'swot' | 'projections';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isDashboardAvailable: boolean;
  isSwotAvailable: boolean;
  isProjectionsAvailable: boolean;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange, isDashboardAvailable, isSwotAvailable, isProjectionsAvailable }) => {
  const getButtonClasses = (view: View, isDisabled: boolean = false) => {
    const base = 'px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors duration-200';
    const active = 'bg-cyan-600 text-white z-10';
    const inactive = 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600';
    const disabledStyles = 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed';
    
    if (isDisabled) {
      return `${base} ${disabledStyles}`;
    }
    return `${base} ${currentView === view ? active : inactive}`;
  };

  return (
    <div className="flex justify-center p-2 mb-4">
      <div className="inline-flex rounded-md shadow-sm bg-gray-200/50 dark:bg-gray-800/50" role="group">
        <button
          type="button"
          onClick={() => onViewChange('flowchart')}
          className={`${getButtonClasses('flowchart')} rounded-l-md`}
        >
          Flowchart
        </button>
        <button
          type="button"
          onClick={() => onViewChange('text')}
          className={`${getButtonClasses('text')}`}
        >
          Text Plan
        </button>
        <button
          type="button"
          onClick={() => isSwotAvailable && onViewChange('swot')}
          disabled={!isSwotAvailable}
          className={`${getButtonClasses('swot', !isSwotAvailable)}`}
          title={isSwotAvailable ? "View SWOT Analysis" : "SWOT analysis not available for this plan"}
        >
          SWOT
        </button>
        <button
          type="button"
          onClick={() => isDashboardAvailable && onViewChange('dashboard')}
          disabled={!isDashboardAvailable}
          className={`${getButtonClasses('dashboard', !isDashboardAvailable)}`}
          title={isDashboardAvailable ? "View Financial Dashboard" : "Financial data not available for this plan"}
        >
          Dashboard
        </button>
         <button
          type="button"
          onClick={() => isProjectionsAvailable && onViewChange('projections')}
          disabled={!isProjectionsAvailable}
          className={`${getButtonClasses('projections', !isProjectionsAvailable)}`}
          title={isProjectionsAvailable ? "View Interactive Projections" : "Financial data not available for this plan"}
        >
          Projections
        </button>
         <button
          type="button"
          onClick={() => onViewChange('details')}
          className={`${getButtonClasses('details')} rounded-r-md`}
          title={"Edit business details and regenerate plan"}
        >
          Business Details
        </button>
      </div>
    </div>
  );
};

export default ViewSwitcher;