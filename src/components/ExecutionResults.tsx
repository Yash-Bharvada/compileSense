
import React from 'react';
import { Check, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExecutionResult {
  status: 'success' | 'error' | 'running' | 'timeout';
  output: string;
  executionTime?: number;
}

interface ExecutionResultsProps {
  result: ExecutionResult | null;
  className?: string;
}

const ExecutionResults: React.FC<ExecutionResultsProps> = ({ result, className }) => {
  if (!result) {
    return (
      <div className={cn("p-6 text-center flex flex-col items-center justify-center", className)}>
        <p className="text-muted-foreground">Run your code to see results here</p>
      </div>
    );
  }

  // Handle empty output differently based on status
  const formattedOutput = result.output.trim() === '' ? 
    (result.status === 'success' ? 'Program executed without any output.' : 
     result.status === 'error' ? 'No error details available.' : 
     result.status === 'timeout' ? 'Execution timed out without output.' : 
     'Running...') : 
    result.output;

  const statusIcon = {
    success: <Check className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    running: <Clock className="h-5 w-5 text-primary animate-spin" />,
    timeout: <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }[result.status];

  const statusText = {
    success: 'Execution Successful',
    error: 'Execution Failed',
    running: 'Running...',
    timeout: 'Execution Timed Out'
  }[result.status];

  const statusClass = {
    success: 'border-green-200 bg-green-50 text-green-900',
    error: 'border-red-200 bg-red-50 text-red-900',
    running: 'border-blue-200 bg-blue-50 text-blue-900',
    timeout: 'border-yellow-200 bg-yellow-50 text-yellow-900'
  }[result.status];

  return (
    <div className={cn("rounded-lg border transition-all overflow-hidden", className)}>
      <div className={cn("px-4 py-2 border-b flex items-center gap-2", statusClass)}>
        {statusIcon}
        <span className="font-medium">{statusText}</span>
        {result.executionTime !== undefined && (
          <span className="ml-auto text-sm text-muted-foreground">
            {result.executionTime}ms
          </span>
        )}
      </div>
      <div className="p-4 max-h-80 overflow-y-auto">
        <pre className="text-sm whitespace-pre-wrap font-mono">{formattedOutput}</pre>
      </div>
    </div>
  );
};

export default ExecutionResults;
