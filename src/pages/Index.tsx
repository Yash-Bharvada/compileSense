
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelector, { ProgrammingLanguage } from '@/components/LanguageSelector';
import ExecutionResults from '@/components/ExecutionResults';
import ComplexityAnalysis, { ComplexityData } from '@/components/ComplexityAnalysis';
import AIInsights from '@/components/AIInsights';
import { executeCode, analyzeComplexity, getAIInsights, Insight } from '@/services/codeService';
import { Split, Code, Wand2, Cpu } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Index = () => {
  const [language, setLanguage] = useState<ProgrammingLanguage>('javascript');
  const [code, setCode] = useState('');
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'error' | 'running';
    output: string;
    executionTime?: number;
  } | null>(null);
  const [complexityData, setComplexityData] = useState<ComplexityData | null>(null);
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [activeTab, setActiveTab] = useState('results');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleLanguageChange = (lang: ProgrammingLanguage) => {
    setLanguage(lang);
    // Reset results when language changes
    setExecutionResult(null);
    setComplexityData(null);
    setInsights(null);
  };

  const handleRunCode = async () => {
    if (isExecuting) return;
    
    try {
      setIsExecuting(true);
      setExecutionResult({ status: 'running', output: 'Executing code...' });
      setActiveTab('results');
      
      // Execute code
      const result = await executeCode(code, language);
      setExecutionResult(result);
      
      if (result.status === 'success') {
        // Get complexity analysis
        const complexity = await analyzeComplexity(code, language);
        setComplexityData(complexity);
        
        // Get AI insights
        const aiInsights = await getAIInsights(code, language, complexity);
        setInsights(aiInsights);
        
        toast.success('Code executed successfully', {
          description: `Execution time: ${result.executionTime}ms`,
        });
      } else {
        toast.error('Execution failed', {
          description: result.output.split('\n')[0],
        });
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setExecutionResult({
        status: 'error',
        output: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      });
      
      toast.error('Error executing code', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
    toast.success('Code applied', {
      description: 'AI suggestion has been applied to the editor',
    });
  };

  const renderTabIcon = (tab: string) => {
    switch (tab) {
      case 'results':
        return <Code className="h-4 w-4" />;
      case 'analysis':
        return <Cpu className="h-4 w-4" />;
      case 'insights':
        return <Wand2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Editor Section */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-medium tracking-tight">
                <span className="text-primary">Compile</span>Genius
              </h1>
              <LanguageSelector 
                selectedLanguage={language} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
            
            <CodeEditor 
              code={code}
              language={language}
              onChange={setCode}
              onRunCode={handleRunCode}
            />
          </div>
          
          {/* Results Section */}
          <div className="md:col-span-4 space-y-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="results" className="flex items-center">
                  {renderTabIcon('results')}
                  <span className="ml-2">Results</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center">
                  {renderTabIcon('analysis')}
                  <span className="ml-2">Analysis</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center">
                  {renderTabIcon('insights')}
                  <span className="ml-2">Insights</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="mt-4">
                <ExecutionResults result={executionResult} />
              </TabsContent>
              
              <TabsContent value="analysis" className="mt-4">
                <ComplexityAnalysis data={complexityData} />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-4">
                <AIInsights 
                  insights={insights} 
                  onApplyCode={handleApplyCode}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CompileGenius. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
