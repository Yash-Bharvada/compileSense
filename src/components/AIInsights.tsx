
import React, { useState } from 'react';
import { Lightbulb, Sparkles, Code, AlertCircle, ArrowRight, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Insight {
  type: 'suggestion' | 'optimization' | 'warning';
  title: string;
  description: string;
  code?: string;
  rationale?: string;
  impact?: string;
}

interface AIInsightsProps {
  insights: Insight[] | null;
  onApplyCode?: (code: string) => void;
  className?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ 
  insights, 
  onApplyCode,
  className 
}) => {
  const [activeInsight, setActiveInsight] = useState<number | null>(0);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, boolean>>({});
  const [codeApplied, setCodeApplied] = useState<Record<number, boolean>>({});

  if (!insights || insights.length === 0) {
    return (
      <div className={cn("rounded-lg border p-6 text-center", className)}>
        <Sparkles className="h-5 w-5 mx-auto mb-2 text-primary/50" />
        <p className="text-muted-foreground">AI analysis will appear here after running your code</p>
      </div>
    );
  }

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-amber-500" />;
      case 'optimization':
        return <Sparkles className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const giveFeedback = (index: number, positive: boolean) => {
    setFeedbackGiven(prev => ({ ...prev, [index]: true }));
    // Here you would typically send feedback to your backend
    console.log(`Feedback for insight ${index}: ${positive ? 'positive' : 'negative'}`);
  };

  const handleApplyCode = (index: number, code: string) => {
    if (onApplyCode) {
      onApplyCode(code);
      setCodeApplied(prev => ({ ...prev, [index]: true }));
    }
  };

  return (
    <div className={cn("rounded-lg border overflow-hidden", className)}>
      <div className="px-4 py-2 border-b bg-secondary/50 flex items-center">
        <Sparkles className="h-4 w-4 mr-2 text-primary" />
        <h3 className="font-medium">AI Insights</h3>
      </div>
      
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/3 border-r bg-muted/20">
          {insights.map((insight, index) => (
            <button
              key={index}
              className={cn(
                "w-full px-4 py-3 text-left border-b hover:bg-secondary/50 transition-colors",
                activeInsight === index ? "bg-secondary/70" : "bg-transparent",
                codeApplied[index] ? "border-l-4 border-l-green-500" : ""
              )}
              onClick={() => setActiveInsight(index)}
            >
              <div className="flex items-center">
                {getInsightIcon(insight.type)}
                <span className="ml-2 font-medium text-sm truncate">{insight.title}</span>
                {codeApplied[index] && <CheckCircle className="h-3 w-3 ml-auto text-green-500" />}
              </div>
            </button>
          ))}
        </div>
        
        <div className="w-full md:w-2/3 p-4">
          {activeInsight !== null && insights[activeInsight] && (
            <div className="flex flex-col h-full animate-fade-in">
              <div className="flex items-center mb-2">
                {getInsightIcon(insights[activeInsight].type)}
                <h4 className="ml-2 font-medium">{insights[activeInsight].title}</h4>
              </div>
              
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  {insights[activeInsight].impact && (
                    <TabsTrigger value="impact">Impact</TabsTrigger>
                  )}
                  {insights[activeInsight].rationale && (
                    <TabsTrigger value="rationale">Rationale</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="description" className="text-sm text-muted-foreground mb-4">
                  {insights[activeInsight].description}
                </TabsContent>
                
                {insights[activeInsight].impact && (
                  <TabsContent value="impact" className="text-sm text-muted-foreground mb-4">
                    {insights[activeInsight].impact}
                  </TabsContent>
                )}
                
                {insights[activeInsight].rationale && (
                  <TabsContent value="rationale" className="text-sm text-muted-foreground mb-4">
                    {insights[activeInsight].rationale}
                  </TabsContent>
                )}
              </Tabs>
              
              {insights[activeInsight].code && (
                <div className="mb-4 mt-3">
                  <div className="bg-secondary/50 rounded-md p-3 mb-2">
                    <pre className="text-xs font-mono overflow-x-auto">
                      {insights[activeInsight].code}
                    </pre>
                  </div>
                  
                  <Button 
                    size="sm"
                    className={cn(
                      "text-xs",
                      codeApplied[activeInsight] ? "bg-green-500 hover:bg-green-600" : ""
                    )}
                    onClick={() => handleApplyCode(activeInsight, insights[activeInsight].code!)}
                    disabled={codeApplied[activeInsight]}
                  >
                    {codeApplied[activeInsight] ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Code className="h-3 w-3 mr-1" />
                        Replace Code
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Was this insight helpful?</span>
                {!feedbackGiven[activeInsight] ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => giveFeedback(activeInsight, true)}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Yes
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => giveFeedback(activeInsight, false)}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      No
                    </Button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Thank you for your feedback</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
