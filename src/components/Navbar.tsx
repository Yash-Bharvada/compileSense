
import React from 'react';
import { Code2, Cpu, History, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-background/60 border-b border-border animate-in">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-medium tracking-tight">CompileGenius</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Editor
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Documentation
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Examples
          </a>
          <a href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Pricing
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full">
            <History className="h-5 w-5" />
            <span className="sr-only">History</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Cpu className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
          <Button className="button-primary rounded-full" size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
