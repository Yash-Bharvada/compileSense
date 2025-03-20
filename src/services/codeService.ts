
import { ComplexityData } from '@/components/ComplexityAnalysis';
import { ProgrammingLanguage } from '@/components/LanguageSelector';

// This is a simulated service for code execution and analysis
// In a real application, this would connect to a backend API

interface ExecutionResult {
  status: 'success' | 'error' | 'running';
  output: string;
  executionTime?: number;
}

export interface Insight {
  type: 'suggestion' | 'optimization' | 'warning';
  title: string;
  description: string;
  code?: string;
}

// Simulate code execution with more realistic output based on code
export const executeCode = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ExecutionResult> => {
  console.log(`Executing ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Validate code to detect common syntax errors
  try {
    const syntaxError = detectSyntaxErrors(code, language);
    if (syntaxError) {
      return {
        status: 'error',
        output: syntaxError,
        executionTime: Math.floor(Math.random() * 100) + 50
      };
    }
    
    // Parse and execute the code
    const output = parseAndExecuteCode(code, language);
    
    return {
      status: 'success',
      output: output,
      executionTime: Math.floor(Math.random() * 200) + 100
    };
  } catch (error) {
    return {
      status: 'error',
      output: error instanceof Error ? error.message : String(error),
      executionTime: Math.floor(Math.random() * 100) + 50
    };
  }
};

// Helper function to detect basic syntax errors
const detectSyntaxErrors = (code: string, language: ProgrammingLanguage): string | null => {
  // Check for common syntax issues based on language
  if (language === 'python') {
    if (code.includes('print(') && !code.includes(')')) {
      return 'SyntaxError: unexpected EOF while parsing';
    }
    if ((code.includes('def ') || code.includes('if ') || code.includes('for ')) && !code.includes(':')) {
      return 'SyntaxError: expected ":"';
    }
  } else if (language === 'java') {
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      return 'error: mismatched curly braces';
    }
    if (!code.includes('class')) {
      return 'error: class declaration missing';
    }
    if (code.includes('public class') && !code.includes('public static void main')) {
      return 'error: main method missing';
    }
  } else if (language === 'cpp' || language === 'c') {
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      return 'error: mismatched curly braces';
    }
    
    const hasPrintf = code.includes('printf');
    const hasCout = code.includes('cout');
    
    if (language === 'cpp' && hasCout && !code.includes('iostream')) {
      return 'error: iostream header missing for cout';
    }
    
    if (language === 'c' && hasPrintf && !code.includes('stdio.h')) {
      return 'error: stdio.h header missing for printf';
    }
  }
  
  return null;
};

// Parse and execute the code
const parseAndExecuteCode = (code: string, language: ProgrammingLanguage): string => {
  // Check for Fibonacci function and execution
  if (code.includes('fibonacci') || code.includes('Fibonacci')) {
    let fibonacciArg: number | null = null;
    
    // Try to extract the fibonacci argument
    const fibRegex = /fibonacci\s*\(\s*(\d+)\s*\)/i;
    const match = code.match(fibRegex);
    if (match && match[1]) {
      fibonacciArg = parseInt(match[1], 10);
    }
    
    if (fibonacciArg !== null) {
      // Calculate actual fibonacci result
      return calculateFibonacci(fibonacciArg).toString();
    }
  }
  
  // Extract print statements based on language
  if (language === 'python') {
    const printRegex = /print\s*\(\s*["']?(.*?)["']?\s*\)/g;
    let printMatch;
    let output = '';
    
    while ((printMatch = printRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    if (output) return output.trim();
  } 
  else if (language === 'java') {
    const printRegex = /System\.out\.println\s*\(\s*["']?(.*?)["']?\s*\)/g;
    let printMatch;
    let output = '';
    
    while ((printMatch = printRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    if (output) return output.trim();

    // Check for System.out.print (without ln)
    const printNoLnRegex = /System\.out\.print\s*\(\s*["']?(.*?)["']?\s*\)/g;
    let outputNoLn = '';
    
    while ((printMatch = printNoLnRegex.exec(code)) !== null) {
      outputNoLn += printMatch[1];
    }
    
    if (outputNoLn) return outputNoLn;
  } 
  else if (language === 'cpp') {
    const printRegex = /cout\s*<<\s*["']?(.*?)["']?(?:\s*<<\s*endl)?/g;
    let printMatch;
    let output = '';
    
    while ((printMatch = printRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    if (output) return output.trim();
  } 
  else if (language === 'c') {
    const printRegex = /printf\s*\(\s*["']([^%]*?)["'](?:\s*,\s*.*?)?\s*\)/g;
    let printMatch;
    let output = '';
    
    while ((printMatch = printRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    // Handle printf with format specifiers
    if (!output) {
      const formatPrintRegex = /printf\s*\(\s*["'](.*?)["']\s*,\s*(.*?)\s*\)/g;
      while ((printMatch = formatPrintRegex.exec(code)) !== null) {
        const formatStr = printMatch[1];
        const args = printMatch[2].split(',').map(arg => arg.trim());
        
        // Very simple format string parser
        let formattedOutput = formatStr;
        if (formattedOutput.includes('%d')) {
          formattedOutput = formattedOutput.replace(/%d/, args[0] || '0');
        }
        if (formattedOutput.includes('%s')) {
          formattedOutput = formattedOutput.replace(/%s/, args[0] || 'string');
        }
        if (formattedOutput.includes('%f')) {
          formattedOutput = formattedOutput.replace(/%f/, args[0] || '0.0');
        }
        
        output += formattedOutput + '\n';
      }
    }
    
    if (output) return output.trim();
  }
  
  // If we can't meaningfully parse the program, provide a default message
  const defaultMap: Record<ProgrammingLanguage, string> = {
    python: 'Program executed successfully (no print statements found)',
    java: 'Program compiled and ran successfully (no output statements found)',
    cpp: 'Program executed successfully (no output statements found)',
    c: 'Program executed successfully (no output statements found)'
  };
  
  return defaultMap[language];
};

// Helper function to actually calculate fibonacci
const calculateFibonacci = (n: number): number => {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const c = a + b;
    a = b;
    b = c;
  }
  return b;
};

// Simulate complexity analysis with more accurate evaluations
export const analyzeComplexity = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ComplexityData> => {
  console.log(`Analyzing complexity of ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, check if the code contains different algorithms
  const hasFibonacci = code.includes('fibonacci') && 
                      (code.includes('return') || code.includes('return ')) && 
                      (code.includes('n-1') || code.includes('n - 1')) && 
                      (code.includes('n-2') || code.includes('n - 2'));
  
  const hasLoop = code.includes('for') || code.includes('while');
  const hasNestedLoop = (code.match(/for/g) || []).length > 1 || 
                        (code.match(/while/g) || []).length > 1 ||
                        (code.includes('for') && code.includes('while'));
  
  if (hasFibonacci) {
    return {
      timeComplexity: {
        best: 'O(2^n)',
        average: 'O(2^n)',
        worst: 'O(2^n)'
      },
      spaceComplexity: 'O(n)',
      analysis: 'The recursive implementation of Fibonacci has exponential time complexity due to repeated calculations of the same values. Consider using dynamic programming or memoization to improve performance.'
    };
  } else if (hasNestedLoop) {
    return {
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'The code contains nested loops, resulting in quadratic time complexity. Each element in the outer loop iterates through all elements in the inner loop.'
    };
  } else if (hasLoop) {
    return {
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'The code has linear time complexity as it processes each element once with a single loop. Space complexity is constant as it uses a fixed amount of memory regardless of input size.'
    };
  }
  
  // Default analysis for other code
  return {
    timeComplexity: {
      best: 'O(1)',
      average: 'O(1)',
      worst: 'O(1)'
    },
    spaceComplexity: 'O(1)',
    analysis: 'The code appears to have constant time complexity as it does not contain loops or recursive calls. It processes a fixed number of operations regardless of input size.'
  };
};

// Simulate AI insights
export const getAIInsights = async (
  code: string, 
  language: ProgrammingLanguage,
  complexityData: ComplexityData
): Promise<Insight[]> => {
  console.log(`Getting AI insights for ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, check if the code contains a recursive fibonacci function
  const hasFibonacci = code.includes('fibonacci') && code.includes('return') && 
                      (code.includes('n-1') || code.includes('n - 1')) && 
                      (code.includes('n-2') || code.includes('n - 2'));
  
  const hasLoop = code.includes('for') || code.includes('while');
  const hasPrint = language === 'python' && code.includes('print');
  const hasSystemOut = language === 'java' && code.includes('System.out');
  const hasCout = language === 'cpp' && code.includes('cout');
  const hasPrintf = (language === 'c' || language === 'cpp') && code.includes('printf');
  
  if (hasFibonacci) {
    // Return optimization insights for fibonacci
    return [
      {
        type: 'optimization',
        title: 'Use Memoization',
        description: 'The current recursive implementation recalculates the same values multiple times. Using memoization can reduce time complexity from O(2^n) to O(n).',
        code: language === 'python'
            ? `# Optimized with memoization
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`
            : language === 'java'
              ? `// Optimized with memoization
public static int fibonacci(int n, Map<Integer, Integer> memo) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;
    memo.put(n, fibonacci(n-1, memo) + fibonacci(n-2, memo));
    return memo.get(n);
}`
              : language === 'cpp' || language === 'c'
                ? `// Optimized with memoization
int fibonacci(int n, std::unordered_map<int, int>& memo) {
    if (memo.find(n) != memo.end()) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo);
    return memo[n];
}`
                : `// Optimized with memoization
int fibonacci(int n, int memo[]) {
    if (memo[n] != -1) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo);
    return memo[n];
}`
      },
      {
        type: 'optimization',
        title: 'Use Iteration Instead of Recursion',
        description: 'An iterative approach can be more efficient for calculating Fibonacci numbers, avoiding stack overhead and potential stack overflow for large inputs.',
        code: language === 'python'
            ? `# Iterative implementation
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for i in range(2, n+1):
        c = a + b
        a = b
        b = c
    return b`
            : language === 'java'
              ? `// Iterative implementation
public static int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`
              : language === 'cpp' || language === 'c'
                ? `// Iterative implementation
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`
                : `// Iterative implementation
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`
      },
      {
        type: 'warning',
        title: 'Stack Overflow Risk',
        description: 'The current recursive implementation may cause stack overflow for large values of n (typically n > 40-50). Consider adding a base case check for large inputs.',
        code: null
      }
    ];
  } else if (hasLoop) {
    return [
      {
        type: 'suggestion',
        title: 'Consider Edge Cases',
        description: 'Make sure your loop handles edge cases correctly, such as empty collections or boundary conditions.',
        code: null
      },
      {
        type: 'optimization',
        title: 'Early Termination',
        description: 'Consider adding early termination conditions to your loop when the goal is achieved before iterating through all elements.',
        code: null
      }
    ];
  } else if (hasPrint || hasSystemOut || hasCout || hasPrintf) {
    return [
      {
        type: 'suggestion',
        title: 'Add Error Handling',
        description: 'Consider adding error handling around your output statements to make your code more robust.',
        code: null
      },
      {
        type: 'suggestion',
        title: 'Format Output',
        description: 'Use formatting to make your output more readable and structured.',
        code: language === 'python'
            ? `# Formatted output
print(f"The result is: {result}")` 
            : language === 'java'
              ? `// Formatted output
System.out.printf("The result is: %d\\n", result);`
              : language === 'cpp'
                ? `// Formatted output
std::cout << "The result is: " << result << std::endl;`
                : `// Formatted output
printf("The result is: %d\\n", result);`
      }
    ];
  }
  
  // Default insights
  return [
    {
      type: 'suggestion',
      title: 'Add Error Handling',
      description: 'Consider adding error handling to make your code more robust. This will help catch and manage unexpected inputs or runtime errors.',
      code: null
    },
    {
      type: 'suggestion',
      title: 'Add Documentation',
      description: 'Adding comments and documentation can make your code more maintainable and easier for others to understand.',
      code: null
    }
  ];
};
