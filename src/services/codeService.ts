import { ComplexityData } from '@/components/ComplexityAnalysis';
import { ProgrammingLanguage } from '@/components/LanguageSelector';

// This is a simulated service for code execution and analysis
// In a real application, this would connect to a backend API

interface ExecutionResult {
  status: 'success' | 'error' | 'running' | 'timeout';
  output: string;
  executionTime?: number;
}

export interface Insight {
  type: 'suggestion' | 'optimization' | 'warning';
  title: string;
  description: string;
  code?: string;
  rationale?: string;
  impact?: string;
}

// Maximum execution time before timeout (ms)
const EXECUTION_TIMEOUT = 5000;

// Simulate code execution with more reliable output handling
export const executeCode = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ExecutionResult> => {
  console.log(`Executing ${language} code: ${code}`);
  
  // Check for empty code
  if (!code.trim()) {
    return {
      status: 'error',
      output: 'No code provided for execution.',
      executionTime: 10
    };
  }
  
  // Start execution timer
  const startTime = Date.now();
  
  // Set up timeout protection
  const timeoutPromise = new Promise<ExecutionResult>((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'timeout',
        output: 'Execution timed out. Your code may contain an infinite loop or is taking too long to process.',
        executionTime: EXECUTION_TIMEOUT
      });
    }, EXECUTION_TIMEOUT);
  });
  
  // Actual execution logic
  const executionPromise = new Promise<ExecutionResult>(async (resolve) => {
    try {
      // Simulate network delay for more realistic behavior
      await new Promise(r => setTimeout(r, Math.min(800, Math.random() * 1000 + 500)));
      
      // Validate code to detect common syntax errors
      const syntaxError = detectSyntaxErrors(code, language);
      if (syntaxError) {
        return resolve({
          status: 'error',
          output: syntaxError,
          executionTime: Date.now() - startTime
        });
      }
      
      // Execute the code based on its actual content
      const output = simulateExecution(code, language);
      
      resolve({
        status: 'success',
        output: output,
        executionTime: Date.now() - startTime
      });
    } catch (error) {
      resolve({
        status: 'error',
        output: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime
      });
    }
  });
  
  // Race between execution and timeout
  return Promise.race([executionPromise, timeoutPromise]);
};

// Helper function to detect basic syntax errors
const detectSyntaxErrors = (code: string, language: ProgrammingLanguage): string | null => {
  // Check for infinite loops
  if ((language === 'python' && /while\s+True/i.test(code) && !code.includes('break')) ||
      ((language === 'java' || language === 'cpp' || language === 'c') && 
       /while\s*\(\s*true\s*\)/i.test(code) && !code.includes('break'))) {
    return 'Potential infinite loop detected: while loop with no break condition';
  }
  
  // Check for common syntax issues based on language
  if (language === 'python') {
    if (code.includes('print(') && !code.includes(')')) {
      return 'SyntaxError: unexpected EOF while parsing';
    }
    if ((code.includes('def ') || code.includes('if ') || code.includes('for ')) && !code.includes(':')) {
      return 'SyntaxError: expected ":"';
    }
    if (code.includes('input(') && !code.includes(')')) {
      return 'SyntaxError: input statement is missing closing parenthesis';
    }
  } else if (language === 'java') {
    if ((code.match(/\{/g) || []).length !== (code.match(/\}/g) || []).length) {
      return 'error: mismatched curly braces';
    }
    if (!code.includes('class')) {
      return 'error: class declaration missing';
    }
    if (code.includes('public static void main') && !code.includes('{')) {
      return 'error: main method body missing';
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
    
    if (!code.includes('main')) {
      return 'error: main function missing';
    }
  }
  
  return null;
};

// Function to simulate actual code execution with better output guarantees
const simulateExecution = (code: string, language: ProgrammingLanguage): string => {
  // First check for input statements that would block execution
  if (hasInputStatements(code, language)) {
    return simulateInputExecution(code, language);
  }
  
  // Extract print statements for accurate output
  const printOutput = extractPrintStatements(code, language);
  if (printOutput && printOutput.trim()) {
    return printOutput;
  }
  
  // Detect common algorithms and patterns with improved output
  if (isFibonacci(code, language)) {
    return simulateFibonacci(code, language);
  }
  
  if (isBubbleSort(code, language)) {
    return simulateBubbleSort(language);
  }
  
  if (isSelectionSort(code, language)) {
    return simulateSelectionSort(language);
  }
  
  if (isHelloWorld(code, language)) {
    return "Hello, World!";
  }
  
  // Handle array sorting/output patterns
  if (hasArrayOutput(code, language)) {
    return simulateArrayOutput(language);
  }

  // Look for factorial calculation
  if (isFactorial(code, language)) {
    return simulateFactorial(language);
  }
  
  // Default responses based on recognized code patterns
  if (hasForLoop(code)) {
    return "Loop executed successfully.\nOutput: 0 1 2 3 4";
  }
  
  if (hasRecursion(code)) {
    return "Recursive function executed.\nResult: 55";
  }

  // If we can't determine what the code does, provide generic success message with example output
  return getDefaultOutput(language);
};

// Check for input statements that would block execution
const hasInputStatements = (code: string, language: ProgrammingLanguage): boolean => {
  if (language === 'python') {
    return code.includes('input(');
  } else if (language === 'java') {
    return code.includes('Scanner') && code.includes('.next');
  } else if (language === 'cpp') {
    return code.includes('cin >>');
  } else if (language === 'c') {
    return code.includes('scanf');
  }
  return false;
};

// Simulate execution with inputs
const simulateInputExecution = (code: string, language: ProgrammingLanguage): string => {
  let output = '';
  
  if (language === 'python') {
    if (code.includes('input(') && code.includes('print(')) {
      output = "Simulated input: 42\nOutput: 42\n";
      
      // If we detect calculation with input, add calculated output
      if (code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/')) {
        output += "Calculated result: 84";
      }
    } else {
      output = "Simulated input: 42";
    }
  } else if (language === 'java') {
    if (code.includes('Scanner') && code.includes('System.out.print')) {
      output = "Simulated input: 42\nOutput: 42\n";
      
      if (code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/')) {
        output += "Calculated result: 84";
      }
    } else {
      output = "Simulated input: 42";
    }
  } else if (language === 'cpp') {
    if (code.includes('cin >>') && code.includes('cout <<')) {
      output = "Simulated input: 42\nOutput: 42\n";
      
      if (code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/')) {
        output += "Calculated result: 84";
      }
    } else {
      output = "Simulated input: 42";
    }
  } else if (language === 'c') {
    if (code.includes('scanf') && code.includes('printf')) {
      output = "Simulated input: 42\nOutput: 42\n";
      
      if (code.includes('+') || code.includes('-') || code.includes('*') || code.includes('/')) {
        output += "Calculated result: 84";
      }
    } else {
      output = "Simulated input: 42";
    }
  }
  
  return output;
};

// Improved extract and simulate execution of print statements
const extractPrintStatements = (code: string, language: ProgrammingLanguage): string => {
  let output = '';
  
  if (language === 'python') {
    // Match print statements more accurately
    const printRegex = /print\s*\(\s*([^()]*?)\s*\)/g;
    let match;
    
    while ((match = printRegex.exec(code)) !== null) {
      const printContent = match[1].trim();
      
      // Check if printing a function call
      if (printContent.includes('fibonacci') || printContent.includes('fib')) {
        const fibMatch = printContent.match(/fib\w*\s*\(\s*(\d+)\s*\)/);
        if (fibMatch && fibMatch[1]) {
          const n = parseInt(fibMatch[1], 10);
          output += calculateFibonacci(n) + '\n';
        } else {
          output += '55\n'; // Default fibonacci(10) result
        }
      } 
      // Check if printing a variable
      else if (!printContent.startsWith('"') && !printContent.startsWith("'")) {
        output += `42\n`; // Default variable value
      } 
      // Otherwise, print the literal string
      else {
        output += printContent.replace(/['"]/g, '') + '\n';
      }
    }
  } 
  else if (language === 'java') {
    const printlnRegex = /System\.out\.println\s*\(\s*["']?(.*?)["']?\s*\)/g;
    const printRegex = /System\.out\.print\s*\(\s*["']?(.*?)["']?\s*\)/g;
    let printMatch;
    
    while ((printMatch = printlnRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    while ((printMatch = printRegex.exec(code)) !== null) {
      output += printMatch[1];
    }
    
    // Check for variable printing
    const printVarRegex = /System\.out\.print(?:ln)?\s*\(\s*([a-zA-Z0-9_]+)\s*\)/g;
    while ((printMatch = printVarRegex.exec(code)) !== null) {
      output += `Variable ${printMatch[1]}: 42\n`;
    }
  } 
  else if (language === 'cpp') {
    const coutRegex = /cout\s*<<\s*["']?(.*?)["']?(?:\s*<<\s*endl)?/g;
    let printMatch;
    
    while ((printMatch = coutRegex.exec(code)) !== null) {
      if (code.includes('endl') || code.includes('\\n')) {
        output += printMatch[1] + '\n';
      } else {
        output += printMatch[1];
      }
    }
    
    // Check for variable output
    const coutVarRegex = /cout\s*<<\s*([a-zA-Z0-9_]+)/g;
    while ((printMatch = coutVarRegex.exec(code)) !== null) {
      if (printMatch[1] !== 'endl') {
        output += `Variable ${printMatch[1]}: 42\n`;
      }
    }
  } 
  else if (language === 'c') {
    const printfRegex = /printf\s*\(\s*["']([^%]*?)["'](?:\s*,\s*.*?)?\s*\)/g;
    const formatPrintfRegex = /printf\s*\(\s*["'](.*?)["']\s*,\s*(.*?)\s*\)/g;
    let printMatch;
    
    while ((printMatch = printfRegex.exec(code)) !== null) {
      output += printMatch[1] + '\n';
    }
    
    while ((printMatch = formatPrintfRegex.exec(code)) !== null) {
      const formatStr = printMatch[1];
      const args = printMatch[2].split(',').map(arg => arg.trim());
      
      // Simple format string parsing
      let formattedOutput = formatStr;
      if (formattedOutput.includes('%d')) {
        formattedOutput = formattedOutput.replace(/%d/, args[0] || '42');
      }
      if (formattedOutput.includes('%s')) {
        formattedOutput = formattedOutput.replace(/%s/, args[0] || 'text');
      }
      if (formattedOutput.includes('%f')) {
        formattedOutput = formattedOutput.replace(/%f/, args[0] || '42.0');
      }
      
      output += formattedOutput + '\n';
    }
  }
  
  return output.trim();
};

// Improved Fibonacci detection
const isFibonacci = (code: string, language: ProgrammingLanguage): boolean => {
  return (code.toLowerCase().includes('fibonacci') || code.toLowerCase().includes('fib')) &&
         ((code.includes('n-1') || code.includes('n - 1')) &&
         (code.includes('n-2') || code.includes('n - 2')) ||
         (code.includes('a + b') || code.includes('a+b')));
};

// Improved Fibonacci simulation
const simulateFibonacci = (code: string, language: ProgrammingLanguage): string => {
  // Try to extract the fibonacci argument
  let n = 10; // Default
  const fibRegex = /fib\w*\s*\(\s*(\d+)\s*\)/i;
  const match = code.match(fibRegex);
  if (match && match[1]) {
    n = parseInt(match[1], 10);
  }
  
  // Calculate actual fibonacci result
  const result = calculateFibonacci(n);
  
  // Check if the code has a print statement
  if (language === 'python' && code.includes('print')) {
    return `${result}`;
  } else if (language === 'java' && code.includes('System.out.print')) {
    return `${result}`;
  } else if (language === 'cpp' && code.includes('cout')) {
    return `${result}`;
  } else if (language === 'c' && code.includes('printf')) {
    return `${result}`;
  }
  
  return `Input: n = ${n}\nFibonacci(${n}) = ${result}`;
};

// Detect if code is Bubble Sort implementation
const isBubbleSort = (code: string, language: ProgrammingLanguage): boolean => {
  const hasNestedLoops = (code.match(/for\s*\(/g) || []).length >= 2;
  const hasSwap = code.includes('swap') || 
                 (code.includes('temp') && (code.includes('>')));
  
  return hasNestedLoops && hasSwap;
};

// Simulate bubble sort output
const simulateBubbleSort = (language: ProgrammingLanguage): string => {
  const input = [5, 1, 4, 2, 8];
  const output = [1, 2, 4, 5, 8];
  
  let result = '';
  
  if (language === 'java') {
    result = `Original array: [5, 1, 4, 2, 8]\nSorted array: [1, 2, 4, 5, 8]`;
  } else if (language === 'python') {
    result = `Original array: [5, 1, 4, 2, 8]\nSorted array: [1, 2, 4, 5, 8]`;
  } else if (language === 'cpp' || language === 'c') {
    result = `Original array: 5 1 4 2 8\nSorted array: 1 2 4 5 8`;
  }
  
  return result;
};

// Detect if code is Selection Sort implementation
const isSelectionSort = (code: string, language: ProgrammingLanguage): boolean => {
  const hasNestedLoops = (code.match(/for\s*\(/g) || []).length >= 2;
  const hasMin = code.includes('min') || code.includes('minimum');
  const hasSwap = code.includes('swap') || 
                 (code.includes('temp') && code.includes('='));
  
  return hasNestedLoops && (hasMin || hasSwap);
};

// Simulate selection sort output
const simulateSelectionSort = (language: ProgrammingLanguage): string => {
  if (language === 'java') {
    return "Original array: [5, 1, 4, 2, 8]\nSorted array: [1, 2, 4, 5, 8]";
  } else if (language === 'python') {
    return "Original array: [5, 1, 4, 2, 8]\nSorted array: [1, 2, 4, 5, 8]";
  } else if (language === 'cpp' || language === 'c') {
    return "Original array: 5 1 4 2 8\nSorted array: 1 2 4 5 8";
  }
  
  return "Sorted array: 1 2 4 5 8";
};

// Detect if code is a Hello World program
const isHelloWorld = (code: string, language: ProgrammingLanguage): boolean => {
  if (language === 'python') {
    return code.includes('print') && 
           (code.includes('"Hello') || code.includes("'Hello"));
  } else if (language === 'java') {
    return code.includes('System.out.print') && 
           (code.includes('"Hello') || code.includes("'Hello"));
  } else if (language === 'cpp') {
    return code.includes('cout') && 
           (code.includes('"Hello') || code.includes("'Hello"));
  } else if (language === 'c') {
    return code.includes('printf') && 
           (code.includes('"Hello') || code.includes("'Hello"));
  }
  
  return false;
};

// Check if code has array output operations
const hasArrayOutput = (code: string, language: ProgrammingLanguage): boolean => {
  return code.includes('array') || 
         code.includes('[]') || 
         code.includes('list') || 
         (code.includes('for') && code.includes('print')) ||
         (code.includes('for') && code.includes('cout')) ||
         (code.includes('for') && code.includes('printf')) ||
         (code.includes('for') && code.includes('System.out'));
};

// Simulate array output
const simulateArrayOutput = (language: ProgrammingLanguage): string => {
  const array = [1, 2, 3, 4, 5];
  
  if (language === 'python') {
    return `Array/List elements: [1, 2, 3, 4, 5]`;
  } else if (language === 'java') {
    return `Array elements: [1, 2, 3, 4, 5]`;
  } else if (language === 'cpp' || language === 'c') {
    return `Array elements: 1 2 3 4 5`;
  }
  
  return `Array elements: ${array.join(' ')}`;
};

// Check if code has a for loop
const hasForLoop = (code: string): boolean => {
  return code.includes('for ') || code.includes('for(');
};

// Check if code has recursion
const hasRecursion = (code: string): boolean => {
  return code.includes('return') && 
         ((code.includes('(') && code.includes(')')) || 
          code.includes('call'));
};

// Default output messages by language
const getDefaultOutput = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return 'Program executed successfully.\nOutput: 42';
  } else if (language === 'java') {
    return 'Program compiled and ran successfully.\nOutput: 42';
  } else if (language === 'cpp') {
    return 'Program executed successfully.\nOutput: 42';
  } else if (language === 'c') {
    return 'Program executed successfully.\nOutput: 42';
  }
  
  return 'Program executed successfully.\nOutput: 42';
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

// Detect if code calculates factorial
const isFactorial = (code: string, language: ProgrammingLanguage): boolean => {
  return (code.includes('factorial') || code.includes('Factorial')) &&
         (code.includes('n *') || code.includes('n*') || code.includes('* n'));
};

// Simulate factorial calculation
const simulateFactorial = (language: ProgrammingLanguage): string => {
  const n = 5;
  const factorial = 120; // 5!
  
  if (language === 'java') {
    return `Input: n = ${n}\nFactorial(${n}) = ${factorial}`;
  } else if (language === 'python') {
    return `Input: n = ${n}\nFactorial(${n}) = ${factorial}`;
  } else if (language === 'cpp' || language === 'c') {
    return `Input: n = ${n}\nFactorial(${n}) = ${factorial}`;
  }
  
  return `Input: n = ${n}\nFactorial(${n}) = ${factorial}`;
};

// Simulate complexity analysis with more accurate evaluations
export const analyzeComplexity = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ComplexityData> => {
  console.log(`Analyzing complexity of ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Enhanced code analysis logic - detect more code patterns
  const hasRecursion = code.includes('return') && 
                      ((code.includes('(') && code.includes(')')) || 
                      code.includes('call'));
  
  const hasDynamicProgramming = code.includes('memo') || 
                               (code.includes('dp') && (code.includes('array') || code.includes('[]')));
  
  const hasBinarySearch = code.includes('mid') && code.includes('left') && code.includes('right');
  
  const hasDivideAndConquer = code.includes('merge') || 
                             (code.includes('divide') && code.includes('conquer'));
  
  const hasGreedy = code.includes('greedy') || 
                   (code.includes('sort') && code.includes('max') && code.includes('pick'));
                   
  // Check for specific code patterns to provide more accurate analysis
  if (hasFibonacci(code, language)) {
    // ... keep existing code (fibonacci analysis)
    return {
      timeComplexity: {
        best: 'O(2^n)',
        average: 'O(2^n)',
        worst: 'O(2^n)'
      },
      spaceComplexity: 'O(n)',
      analysis: 'The recursive implementation of Fibonacci has exponential time complexity due to repeated calculations of the same values. Each function call branches into two more calls until reaching the base cases, creating an exponential number of function calls. The space complexity is O(n) due to the maximum recursion depth.'
    };
  } else if (hasDynamicProgramming) {
    return {
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(n)',
      analysis: 'This dynamic programming approach has linear time complexity as it computes each subproblem exactly once and stores the results to avoid redundant calculations. The space complexity is also linear due to the memoization table or DP array.'
    };
  } else if (hasBinarySearch) {
    return {
      timeComplexity: {
        best: 'O(1)',
        average: 'O(log n)',
        worst: 'O(log n)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'Binary search has logarithmic time complexity as it divides the search space in half with each comparison. The best case is O(1) when the target is found at the middle position initially. Space complexity is constant as it only uses a fixed number of variables.'
    };
  } else if (hasDivideAndConquer) {
    return {
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      analysis: 'This divide and conquer algorithm (likely merge sort or similar) has O(n log n) time complexity. It recursively divides the problem and combines solutions, with log n levels of recursion and n work at each level. The space complexity is O(n) for the auxiliary arrays needed during merging.'
    };
  } else if (hasGreedy) {
    return {
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'This greedy algorithm has O(n log n) time complexity dominated by the sorting operation. After sorting, it makes a single pass through the data to make greedy choices. The space complexity is constant if sorting is done in-place.'
    };
  } else if (isNestedLoops(code)) {
    // ... keep existing code (nested loops analysis)
    return {
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'The code contains nested loops, resulting in quadratic time complexity. The outer loop executes n times, and for each iteration, the inner loop also executes up to n times, leading to approximately n² total operations. Space complexity is constant as it only uses a fixed amount of additional memory regardless of input size.'
    };
  } else if (hasLoop(code)) {
    // ... keep existing code (single loop analysis)
    return {
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n)',
        worst: 'O(n)'
      },
      spaceComplexity: 'O(1)',
      analysis: 'The code has linear time complexity as it processes each element once with a single loop. Each element requires a constant number of operations, resulting in linear scaling with input size. Space complexity is constant as it uses a fixed amount of memory regardless of input size.'
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
    analysis: 'The code appears to have constant time complexity as it does not contain loops or recursive calls. It processes a fixed number of operations regardless of input size, resulting in constant time execution.'
  };
};

// Function to check if code has nested loops
const isNestedLoops = (code: string): boolean => {
  const forLoopMatches = code.match(/for\s*\(/g) || [];
  const whileLoopMatches = code.match(/while\s*\(/g) || [];
  
  return forLoopMatches.length + whileLoopMatches.length >= 2 &&
         (code.includes('for') && code.includes('for', code.indexOf('for') + 3)) ||
         (code.includes('while') && code.includes('while', code.indexOf('while') + 5)) ||
         (code.includes('for') && code.includes('while')) ||
         (code.includes('while') && code.includes('for'));
};

// Enhanced function to detect if the code is a Fibonacci algorithm
const hasFibonacci = (code: string, language: ProgrammingLanguage): boolean => {
  // ... keep existing code (fibonacci detection)
  return (code.toLowerCase().includes('fibonacci') || code.toLowerCase().includes('fib')) &&
         ((code.includes('n-1') || code.includes('n - 1')) &&
         (code.includes('n-2') || code.includes('n - 2')) ||
         (code.includes('a + b') || code.includes('a+b')));
};

// Check if code has a loop
const hasLoop = (code: string): boolean => {
  // ... keep existing code (loop detection)
  return code.includes('for ') || code.includes('for(') || 
         code.includes('while ') || code.includes('while(');
};

// Simulate AI insights with more detailed and accurate information
export const getAIInsights = async (
  code: string, 
  language: ProgrammingLanguage,
  complexityData: ComplexityData
): Promise<Insight[]> => {
  console.log(`Getting AI insights for ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Enhanced insights based on code patterns
  const insights: Insight[] = [];
  
  // Check for recursive Fibonacci implementation
  if (hasFibonacci(code, language) && 
      code.includes('return') && 
      (code.includes('n-1') || code.includes('n - 1')) && 
      (code.includes('n-2') || code.includes('n - 2'))) {
    
    insights.push({
      type: 'optimization',
      title: 'Use Memoization',
      description: 'The current recursive implementation recalculates the same values multiple times, leading to inefficient execution.',
      rationale: 'Memoization stores already computed values, eliminating redundant calculations and significantly improving performance.',
      impact: 'Reduces time complexity from exponential O(2^n) to linear O(n), making the algorithm practical for larger inputs.',
      code: generateMemoizationCode(language)
    });
    
    insights.push({
      type: 'optimization',
      title: 'Use Iteration Instead of Recursion',
      description: 'An iterative approach can be more efficient for calculating Fibonacci numbers.',
      rationale: 'Iterative solutions avoid the overhead of recursive function calls and potential stack overflow issues for large inputs.',
      impact: 'Reduces both time and space complexity, while maintaining the same mathematical result.',
      code: generateIterativeFibonacciCode(language)
    });
    
    insights.push({
      type: 'warning',
      title: 'Stack Overflow Risk',
      description: 'The current recursive implementation may cause stack overflow for large values of n (typically n > 40-50).',
      rationale: 'Each recursive call adds a new frame to the call stack. With exponential growth, large inputs quickly exceed available stack space.',
      impact: 'The program will crash for moderately large inputs, making it unreliable for production use.',
      code: generateBaseCheckCode(language)
    });
    
  } else if (isNestedLoops(code)) {
    insights.push({
      type: 'optimization',
      title: 'Consider Time Complexity',
      description: 'Your code contains nested loops, resulting in quadratic O(n²) time complexity.',
      rationale: 'Nested loops process each element multiple times, which can be inefficient for large datasets.',
      impact: 'May lead to performance issues with large inputs. Consider if a more efficient algorithm exists for your specific problem.',
      code: null
    });
    
    insights.push({
      type: 'suggestion',
      title: 'Early Termination',
      description: 'Consider adding break conditions to exit loops early when a solution is found.',
      rationale: 'Early termination can significantly improve average-case performance while maintaining correctness.',
      impact: 'Could improve performance substantially for cases where the target is found early in the dataset.',
      code: generateEarlyTerminationCode(language)
    });
    
  } else if (hasLoop(code)) {
    insights.push({
      type: 'suggestion',
      title: 'Handle Edge Cases',
      description: 'Ensure your loop properly handles edge cases like empty collections or boundary conditions.',
      rationale: 'Edge cases are often sources of bugs. Explicit handling improves robustness and readability.',
      impact: 'Prevents potential runtime errors and unexpected behavior with unusual inputs.',
      code: generateEdgeCaseCode(language)
    });
    
    if (code.includes('array') || code.includes('list') || code.includes('[]')) {
      insights.push({
        type: 'optimization',
        title: 'Consider Pre-allocation',
        description: 'If your code builds a result collection inside a loop, consider pre-allocating its size.',
        rationale: 'Dynamic resizing of collections (like ArrayList or Python lists) can be expensive when done repeatedly.',
        impact: 'Improves performance by avoiding multiple memory reallocations during execution.',
        code: generatePreallocationCode(language)
      });
    }
  }
  
  // Add language-specific insights
  if (language === 'python') {
    if (code.includes('for ') && !code.includes('enumerate(')) {
      insights.push({
        type: 'suggestion',
        title: 'Use enumerate() for Counter Variables',
        description: 'When you need both the index and value in a loop, use enumerate() instead of manual indexing.',
        rationale: 'enumerate() is more Pythonic and less error-prone than maintaining a separate counter variable.',
        impact: 'Improves code readability and reduces the chance of off-by-one errors.',
        code: `# Instead of:
i = 0
for item in items:
    print(i, item)
    i += 1

# Use enumerate:
for i, item in enumerate(items):
    print(i, item)`
      });
    }
    
    if (code.includes('if ') && code.includes('else') && !code.includes('elif')) {
      insights.push({
        type: 'suggestion',
        title: 'Consider Using Conditional Expressions',
        description: 'For simple if-else statements that assign values, use Python\'s conditional expressions.',
        rationale: 'Conditional expressions are more concise and expressive for simple value assignments.',
        impact: 'Reduces code verbosity while maintaining readability for simple conditions.',
        code: `# Instead of:
if condition:
    x = value1
else:
    x = value2

# Use:
x = value1 if condition else value2`
      });
    }
  } else if (language === 'java') {
    if (code.includes('for (') && code.includes('get(') && !code.includes('forEach')) {
      insights.push({
        type: 'suggestion',
        title: 'Use Enhanced For Loop or forEach()',
        description: 'For iterating over collections, consider using enhanced for loops or the forEach() method.',
        rationale: 'Modern Java idioms improve readability and reduce the chance of indexing errors.',
        impact: 'Makes code more concise and less error-prone for collection traversal.',
        code: `// Instead of:
for (int i = 0; i < list.size(); i++) {
    Item item = list.get(i);
    // process item
}

// Use:
for (Item item : list) {
    // process item
}

// Or:
list.forEach(item -> {
    // process item
});`
      });
    }
  } else if (language === 'cpp') {
    if (code.includes('for (') && code.includes('push_back') && !code.includes('reserve')) {
      insights.push({
        type: 'optimization',
        title: 'Reserve Vector Capacity',
        description: 'When building vectors in a loop, reserve capacity upfront if the size is known.',
        rationale: 'Calling reserve() prevents multiple reallocations and copies as the vector grows.',
        impact: 'Improves performance by reducing memory management overhead during execution.',
        code: `// Instead of:
std::vector<int> result;
for (int i = 0; i < n; i++) {
    result.push_back(calculate(i));
}

// Use:
std::vector<int> result;
result.reserve(n);  // Reserve space for n elements
for (int i = 0; i < n; i++) {
    result.push_back(calculate(i));
}`
      });
    }
  }
  
  // If we don't have specific insights, add generic ones
  if (insights.length === 0) {
    insights.push({
      type: 'suggestion',
      title: 'Add Error Handling',
      description: 'Consider adding error handling to make your code more robust.',
      rationale: 'Proper error handling prevents crashes and improves user experience when unexpected situations occur.',
      impact: 'Makes your code more reliable and easier to debug when issues arise.',
      code: null
    });
    
    insights.push({
      type: 'suggestion',
      title: 'Add Documentation',
      description: 'Adding comments and documentation can make your code more maintainable.',
      rationale: 'Well-documented code is easier for others (and your future self) to understand and modify.',
      impact: 'Improves long-term maintainability and helps onboard new developers to the codebase.',
      code: null
    });
  }
  
  return insights;
};

// Helper function to generate memoization code examples
const generateMemoizationCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# Optimized with memoization
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`;
  } else if (language === 'java') {
    return `// Optimized with memoization
import java.util.HashMap;
import java.util.Map;

public static int fibonacci(int n) {
    return fibMemo(n, new HashMap<>());
}

private static int fibMemo(int n, Map<Integer, Integer> memo) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;
    memo.put(n, fibMemo(n-1, memo) + fibMemo(n-2, memo));
    return memo.get(n);
}`;
  } else if (language === 'cpp') {
    return `// Optimized with memoization
#include <unordered_map>

int fibonacci(int n) {
    std::unordered_map<int, int> memo;
    return fibMemo(n, memo);
}

int fibMemo(int n, std::unordered_map<int, int>& memo) {
    if (memo.find(n) != memo.end()) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);
    return memo[n];
}`;
  } else {
    return `// Optimized with memoization
int fibMemo(int n, int memo[], int size) {
    if (n < size && memo[n] != -1) return memo[n];
    if (n <= 1) return n;
    
    int result = fibMemo(n-1, memo, size) + fibMemo(n-2, memo, size);
    if (n < size) memo[n] = result;
    return result;
}

int fibonacci(int n) {
    int size = n+1 > 1000 ? 1000 : n+1;
    int memo[size];
    for (int i = 0; i < size; i++) memo[i] = -1;
    return fibMemo(n, memo, size);
}`;
  }
};

// Helper function to generate iterative Fibonacci code examples
const generateIterativeFibonacciCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# Iterative implementation
def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for i in range(2, n+1):
        c = a + b
        a = b
        b = c
    return b`;
  } else if (language === 'java') {
    return `// Iterative implementation
public static int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`;
  } else if (language === 'cpp' || language === 'c') {
    return `// Iterative implementation
int fibonacci(int n) {
    if (n <= 1) return n;
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`;
  }
  
  return '';
};

// Helper function to generate edge case handling code
const generateEdgeCaseCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# With edge case handling
def process_list(items):
    # Handle empty list case
    if not items:
        return []
    
    result = []
    for item in items:
        # Handle None items
        if item is None:
            continue
        result.append(process_item(item))
    return result`;
  } else if (language === 'java') {
    return `// With edge case handling
public List<Result> processItems(List<Item> items) {
    // Handle null or empty list
    if (items == null || items.isEmpty()) {
        return Collections.emptyList();
    }
    
    List<Result> results = new ArrayList<>();
    for (Item item : items) {
        // Handle null items
        if (item == null) {
            continue;
        }
        results.add(processItem(item));
    }
    return results;
}`;
  } else if (language === 'cpp') {
    return `// With edge case handling
std::vector<Result> processItems(const std::vector<Item>& items) {
    // Handle empty vector
    if (items.empty()) {
        return {};
    }
    
    std::vector<Result> results;
    results.reserve(items.size());
    for (const auto& item : items) {
        // Handle invalid items
        if (!item.isValid()) {
            continue;
        }
        results.push_back(processItem(item));
    }
    return results;
}`;
  } else {
    return `// With edge case handling
Result* processItems(Item* items, int size, int* resultSize) {
    // Handle null or empty array
    if (items == NULL || size <= 0) {
        *resultSize = 0;
        return NULL;
    }
    
    // Pre-allocate result array
    Result* results = (Result*)malloc(size * sizeof(Result));
    int count = 0;
    
    for (int i = 0; i < size; i++) {
        // Handle invalid items
        if (!isValid(&items[i])) {
            continue;
        }
        results[count++] = processItem(&items[i]);
    }
    
    *resultSize = count;
    return results;
}`;
  }
};

// Helper function to generate early termination code
const generateEarlyTerminationCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# With early termination
def find_element(items, target):
    for i, item in enumerate(items):
        for j, sub_item in enumerate(item):
            if sub_item == target:
                return (i, j)  # Return immediately when found
    return None  # Not found`;
  } else if (language === 'java') {
    return `// With early termination
public Coordinates findElement(List<List<Integer>> matrix, int target) {
    for (int i = 0; i < matrix.size(); i++) {
        List<Integer> row = matrix.get(i);
        for (int j = 0; j < row.size(); j++) {
            if (row.get(j) == target) {
                return new Coordinates(i, j);  // Return immediately when found
            }
        }
    }
    return null;  // Not found
}`;
  } else if (language === 'cpp') {
    return `// With early termination
std::optional<Coordinates> findElement(const std::vector<std::vector<int>>& matrix, int target) {
    for (size_t i = 0; i < matrix.size(); i++) {
        for (size_t j = 0; j < matrix[i].size(); j++) {
            if (matrix[i][j] == target) {
                return Coordinates{i, j};  // Return immediately when found
            }
        }
    }
    return std::nullopt;  // Not found
}`;
  } else {
    return `// With early termination
int findElement(int** matrix, int rows, int cols, int target, int* row, int* col) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (matrix[i][j] == target) {
                *row = i;
                *col = j;
                return 1;  // Found
            }
        }
    }
    return 0;  // Not found
}`;
  }
};

// Helper function to generate preallocation code
const generatePreallocationCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# With pre-allocation
def calculate_values(n):
    # Pre-allocate the list with None values
    results = [None] * n
    for i in range(n):
        results[i] = i * i
    return results`;
  } else if (language === 'java') {
    return `// With pre-allocation
public List<Integer> calculateValues(int n) {
    // Pre-allocate ArrayList with initial capacity
    List<Integer> results = new ArrayList<>(n);
    for (int i = 0; i < n; i++) {
        results.add(i * i);
    }
    return results;
}`;
  } else if (language === 'cpp') {
    return `// With pre-allocation
std::vector<int> calculateValues(int n) {
    // Reserve capacity before adding elements
    std::vector<int> results;
    results.reserve(n);
    for (int i = 0; i < n; i++) {
        results.push_back(i * i);
    }
    return results;
}`;
  } else {
    return `// With pre-allocation
int* calculateValues(int n) {
    // Allocate array with exact size needed
    int* results = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) {
        results[i] = i * i;
    }
    return results;
}`;
  }
};

// Helper function to generate base case check code
const generateBaseCheckCode = (language: ProgrammingLanguage): string => {
  if (language === 'python') {
    return `# With base case limit check
def fibonacci(n, memo={}):
    # Prevent stack overflow with large inputs
    if n > 50:
        return "Input too large for recursive solution"
        
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]`;
  } else if (language === 'java') {
    return `// With base case limit check
public static int fibonacci(int n) {
    // Prevent stack overflow with large inputs
    if (n > 50) {
        throw new IllegalArgumentException("Input too large for recursive solution");
    }
    
    return fibHelper(n, new HashMap<>());
}

private static int fibHelper(int n, Map<Integer, Integer> memo) {
    if (memo.containsKey(n)) return memo.get(n);
    if (n <= 1) return n;
    memo.put(n, fibHelper(n-1, memo) + fibHelper(n-2, memo));
    return memo.get(n);
}`;
  } else if (language === 'cpp' || language === 'c') {
    return `// With base case limit check
int fibonacci(int n) {
    // Prevent stack overflow with large inputs
    if (n > 50) {
        fprintf(stderr, "Input too large for recursive solution\\n");
        return -1; // Error code
    }
    
    std::unordered_map<int, int> memo;
    return fibHelper(n, memo);
}

int fibHelper(int n, std::unordered_map<int, int>& memo) {
    if (memo.find(n) != memo.end()) return memo[n];
    if (n <= 1) return n;
    memo[n] = fibHelper(n-1, memo) + fibHelper(n-2, memo);
    return memo[n];
}`;
  }
  
  return '';
};
