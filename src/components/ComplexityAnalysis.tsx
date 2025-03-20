
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDownCircle, ClockIcon, CpuIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ComplexityData {
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  analysis: string;
}

interface ComplexityAnalysisProps {
  data: ComplexityData | null;
  className?: string;
}

const ComplexityAnalysis: React.FC<ComplexityAnalysisProps> = ({ data, className }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!data) {
    return (
      <div className={cn("rounded-lg border p-4 text-center", className)}>
        <p className="text-muted-foreground">Run your code to see complexity analysis</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border overflow-hidden glass-panel", className)}>
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-medium flex items-center">
          <CpuIcon className="h-4 w-4 mr-2 text-primary" />
          Complexity Analysis
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 text-xs"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
          <ChevronDownCircle 
            className={cn(
              "ml-1 h-4 w-4 transition-transform", 
              isExpanded ? "transform rotate-180" : ""
            )} 
          />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1 text-amber-500" />
              Time Complexity
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 rounded-md">
                <span className="text-xs text-muted-foreground">Best Case:</span>
                <span className="text-sm font-mono">{data.timeComplexity.best}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 rounded-md">
                <span className="text-xs text-muted-foreground">Average Case:</span>
                <span className="text-sm font-mono">{data.timeComplexity.average}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 rounded-md">
                <span className="text-xs text-muted-foreground">Worst Case:</span>
                <span className="text-sm font-mono">{data.timeComplexity.worst}</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <CpuIcon className="h-4 w-4 mr-1 text-blue-500" />
              Space Complexity
            </h4>
            <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/50 rounded-md">
              <span className="text-xs text-muted-foreground">Auxiliary Space:</span>
              <span className="text-sm font-mono">{data.spaceComplexity}</span>
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 p-3 bg-secondary/30 rounded-md text-sm animate-fade-in">
            <h4 className="font-medium mb-1">Analysis</h4>
            <p className="text-muted-foreground">{data.analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplexityAnalysis;
