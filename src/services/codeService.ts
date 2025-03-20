
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

// Simulate code execution
export const executeCode = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ExecutionResult> => {
  console.log(`Executing ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, detect if the code has a fibonacci function
  const hasFibonacci = code.includes('fibonacci');
  
  // For demo purposes, randomly generate errors sometimes
  const shouldFail = Math.random() < 0.3 && !hasFibonacci;
  
  if (shouldFail) {
    return {
      status: 'error',
      output: language === 'python' 
        ? 'IndentationError: unexpected indent'
        : language === 'java'
          ? 'error: class Main is public, should be declared in a file named Main.java'
          : language === 'cpp'
            ? 'error: expected \';\' before \'}\' token'
            : 'error: expected \';\' at the end of declaration',
      executionTime: Math.floor(Math.random() * 100) + 50
    };
  }
  
  return {
    status: 'success',
    output: hasFibonacci ? '55' : 'Hello, World!',
    executionTime: Math.floor(Math.random() * 200) + 100
  };
};

// Simulate complexity analysis
export const analyzeComplexity = async (
  code: string, 
  language: ProgrammingLanguage
): Promise<ComplexityData> => {
  console.log(`Analyzing complexity of ${language} code: ${code}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demo purposes, check if the code contains a recursive fibonacci function
  const hasFibonacci = code.includes('fibonacci') && code.includes('return') && 
                      code.includes('n-1') && code.includes('n-2');
  
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
  }
  
  // Default analysis for other code
  return {
    timeComplexity: {
      best: 'O(1)',
      average: 'O(n)',
      worst: 'O(n)'
    },
    spaceComplexity: 'O(1)',
    analysis: 'The code appears to have linear time complexity as it processes each element once. Space complexity is constant as it uses a fixed amount of memory regardless of input size.'
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
                      code.includes('n-1') && code.includes('n-2');
  
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
              : language === 'cpp'
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
