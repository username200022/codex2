
import React, { useMemo } from 'react';
import { marked } from 'marked';
import { type ChatMessage, type PlanContext, type CapitalItem, type ExpenseItem, type FinancialData, type SWOT } from '../types';
import InteractiveMindMap from './InteractiveMindMap';
import CollapsibleSection from './CollapsibleSection';
import ViewSwitcher from './ViewSwitcher';
import FinancialDashboard from './FinancialDashboard';
import BusinessDetailsEditor from './BusinessDetailsEditor';
import SWOTAnalysisView from './SWOTAnalysisView';
import ExecutiveSummary from './ExecutiveSummary';
import FinancialProjections from './FinancialProjections';
import { highlightKeywords } from '../utils/text-enhancers';
import { parsePlan } from '../utils/plan-parser';


const customBulletSvgLight = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%230891b2'%3e%3cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd' /%3e%3c/svg%3e")`;
const customBulletSvgDark = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2306b6d4'%3e%3cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd' /%3e%3c/svg%3e")`;

const richProseClasses = `
    prose dark:prose-invert max-w-none
    prose-p:my-4 prose-p:leading-relaxed
    prose-headings:text-cyan-600 dark:prose-headings:text-cyan-400 prose-headings:mt-8 prose-headings:mb-3 prose-headings:pb-2 prose-headings:border-b prose-headings:border-gray-200 dark:prose-headings:border-gray-600
    prose-ul:[--tw-prose-bullets-image:var(--bullet-light)] dark:prose-ul:[--tw-prose-bullets-image:var(--bullet-dark)] prose-ul:list-image-[var(--tw-prose-bullets-image)] prose-li:my-2 prose-li:pl-2
    prose-blockquote:bg-gray-100 dark:prose-blockquote:bg-gray-700/50 prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
    prose-code:bg-gray-200/70 dark:prose-code:bg-gray-600/70 prose-code:text-amber-600 dark:prose-code:text-amber-300 prose-code:font-mono prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:before:content-[''] prose-code:after:content-['']
    prose-code:transition-all prose-code:duration-200 hover:prose-code:bg-amber-400/20 hover:prose-code:scale-[1.03]
`;

// Helper function to generate a markdown table from financial data
const generateMarkdownTable = (items: (CapitalItem | ExpenseItem)[]): string => {
    if (!items || items.length === 0) return '';
  
    const isCapital = 'cost' in items[0];
    const header = isCapital ? '| Item | Cost |' : '| Item | Monthly Cost |';
    const divider = '|:-----|---:|'; // Left-align item, right-align cost
    
    const currency = items[0].currency;
  
    const rows = items.map(item => {
      const cost = isCapital ? (item as CapitalItem).cost : (item as ExpenseItem).monthlyCost;
      const formattedCost = `${cost.toLocaleString()} ${currency}`;
      return `| ${item.item} | \`${formattedCost}\` |`;
    }).join('\n');
  
    return ['\n', header, divider, rows].join('\n');
};


interface TextPlanViewProps {
    title: string;
    executiveSummary: string | null;
    sections: { title: string; content: string }[];
    financialData: FinancialData | null;
}

const TextPlanView: React.FC<TextPlanViewProps> = React.memo(({ title, executiveSummary, sections, financialData }) => {
    
    // Inject generated markdown tables back into the content for display
    const sectionsWithTables = useMemo(() => {
        return sections.map(section => {
            let displayContent = section.content;
            if (financialData) {
                if (section.title.toLowerCase().includes('initial capital') && financialData.initialCapital.length > 0) {
                    displayContent += generateMarkdownTable(financialData.initialCapital);
                } else if (section.title.toLowerCase().includes('recurring expenses') && financialData.recurringExpenses.length > 0) {
                    displayContent += generateMarkdownTable(financialData.recurringExpenses);
                }
            }
            return { ...section, content: displayContent };
        });
    }, [sections, financialData]);

    return (
        <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 text-center pb-4 mb-4 border-b-2 border-cyan-500/50">
                {title}
            </h1>
            
            {executiveSummary && <ExecutiveSummary summary={executiveSummary} />}

            {sectionsWithTables.map((section, index) => (
                <CollapsibleSection key={index} title={section.title}>
                    <div
                        style={{
                          '--bullet-light': customBulletSvgLight,
                          '--bullet-dark': customBulletSvgDark,
                        } as React.CSSProperties}
                        className={richProseClasses}
                        dangerouslySetInnerHTML={{ __html: marked.parse(highlightKeywords(section.content)) as string }}
                    />
                </CollapsibleSection>
            ))}
        </div>
    );
});

type WorkspaceView = 'flowchart' | 'text' | 'dashboard' | 'details' | 'swot' | 'projections';

interface PlanWorkspaceProps {
    plan: ChatMessage;
    context: PlanContext;
    onRegenerate: (newAnswers: Record<number, string>) => void;
    currentView: WorkspaceView;
    onViewChange: (view: WorkspaceView) => void;
}

const PlanWorkspace: React.FC<PlanWorkspaceProps> = ({ plan, context, onRegenerate, currentView, onViewChange }) => {
    const { title, executiveSummary, sections, financialData, swotData } = useMemo(() => {
        return parsePlan(plan.content);
    }, [plan.content]);
    
    return (
        <div className="w-full p-4 md:p-6">
            <ViewSwitcher 
                currentView={currentView} 
                onViewChange={onViewChange}
                isDashboardAvailable={!!financialData}
                isSwotAvailable={!!swotData}
                isProjectionsAvailable={!!financialData}
            />
            
            {currentView === 'flowchart' && (
                <InteractiveMindMap title={title} sections={sections} />
            )}
            
            {currentView === 'text' && (
                <TextPlanView
                    title={title}
                    executiveSummary={executiveSummary}
                    sections={sections}
                    financialData={financialData}
                />
            )}

            {currentView === 'dashboard' && financialData && (
                <FinancialDashboard data={financialData} />
            )}

             {currentView === 'swot' && swotData && (
                <SWOTAnalysisView initialSwot={swotData} />
            )}

            {currentView === 'projections' && financialData && (
                <FinancialProjections data={financialData} />
            )}

            {currentView === 'details' && (
                <BusinessDetailsEditor context={context} onRegenerate={onRegenerate} />
            )}
        </div>
    );
};

export default PlanWorkspace;