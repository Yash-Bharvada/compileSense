
import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgrammingLanguage } from './LanguageSelector';

interface CodeEditorProps {
  code: string;
  language: ProgrammingLanguage;
  onChange: (value: string) => void;
  onRunCode: () => void;
  className?: string;
}

// Sample code templates for each language
const codeTemplates: Record<ProgrammingLanguage, string> = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}

// Test with n=10
console.log(fibonacci(10));`,
  python: `# Python Example
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test with n=10
print(fibonacci(10))`,
  java: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n-1) + fibonacci(n-2);
    }
}`,
  cpp: `// C++ Example
#include <iostream>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n-1) + fibonacci(n-2);
}

int main() {
    std::cout << fibonacci(10) << std::endl;
    return 0;
}`
};

// Map our language IDs to Monaco's language IDs
const languageMap: Record<ProgrammingLanguage, string> = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp'
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onChange,
  onRunCode,
  className = ''
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: code || codeTemplates[language],
        language: languageMap[language],
        theme: 'vs',
        minimap: { enabled: false },
        automaticLayout: true,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        tabSize: 2,
        wordWrap: 'on',
        padding: { top: 16, bottom: 16 },
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
      });

      editorRef.current.onDidChangeModelContent(() => {
        if (editorRef.current) {
          onChange(editorRef.current.getValue());
        }
      });
      
      // Simulated AI suggestion after a delay
      setTimeout(() => {
        setIsAiSuggesting(true);
        setTimeout(() => setIsAiSuggesting(false), 3000);
      }, 5000);
      
      return () => {
        editorRef.current?.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, languageMap[language]);
      }
      
      // Update value only if it's a language change to prevent cursor jumps during typing
      if (editorRef.current.getValue() === code) {
        editorRef.current.setValue(codeTemplates[language]);
      }
    }
  }, [language]);

  return (
    <div className={`relative flex flex-col ${className}`}>
      <div 
        ref={containerRef} 
        className="editor-container h-[70vh] overflow-hidden rounded-lg border"
      ></div>
      
      <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
        {isAiSuggesting && (
          <div className="glass-panel py-2 px-4 flex items-center text-sm animate-fade-in">
            <Sparkles className="text-primary h-4 w-4 mr-2 animate-pulse-subtle" />
            <span>Suggestion: Use memoization to improve performance</span>
          </div>
        )}
        <Button 
          onClick={onRunCode}
          className="button-primary shadow-subtle transition-all duration-200 transform hover:translate-y-[-2px]"
        >
          Run Code
        </Button>
      </div>
    </div>
  );
};

export default CodeEditor;
