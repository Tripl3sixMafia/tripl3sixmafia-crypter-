import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import { ArrowRight, Copy, Shield, ShieldCheck, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Premium() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [isCopied, setIsCopied] = useState(false);
  const [status, setStatus] = useState('pending'); // pending, verifying, success, failed
  
  const walletAddress = 'MCSFKLxYj4HRTuvjrs8xv2zrWZks7xqoZz';
  const premiumAmount = 25;

  // Format the remaining time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown timer for transaction verification
  useEffect(() => {
    if (status !== 'pending' || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('failed');
          toast({
            title: "Time expired",
            description: "The transaction verification time has expired. Please try again.",
            variant: "destructive",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [status, timeRemaining, toast]);

  // Handle copying wallet address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Wallet address has been copied to your clipboard",
    });
    
    setTimeout(() => setIsCopied(false), 3000);
  };

  // Verify transaction ID
  const handleVerifyTransaction = async () => {
    if (transactionId.length < 10) {
      toast({
        title: "Invalid transaction ID",
        description: "Please enter a valid transaction ID",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus('verifying');
    
    try {
      // This would normally check the blockchain for the transaction
      // For demo purposes, we'll just accept any transaction ID
      await apiRequest('/api/verify-transaction', {
        method: 'POST',
        body: JSON.stringify({ transactionId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setStatus('success');
      toast({
        title: "Transaction verified!",
        description: "Your premium access has been activated.",
        variant: "default",
      });
      
      // Wait 3 seconds then redirect to home
      setTimeout(() => {
        setLocation('/');
      }, 3000);
      
    } catch (error) {
      setStatus('failed');
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Could not verify transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin bypass for premium - secret code
  const handleAdminBypass = async () => {
    if (transactionId !== "tripl3six6mafia") {
      toast({
        title: "Invalid bypass code",
        description: "The admin bypass code you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus('verifying');
    
    try {
      await apiRequest('/api/admin-premium', {
        method: 'POST',
        body: JSON.stringify({ code: transactionId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setStatus('success');
      toast({
        title: "Admin access granted",
        description: "Premium features have been activated.",
        variant: "default",
      });
      
      // Wait 2 seconds then redirect
      setTimeout(() => {
        setLocation('/');
      }, 2000);
      
    } catch (error) {
      setStatus('failed');
      toast({
        title: "Access denied",
        description: "Invalid admin credentials",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen p-4 mx-auto">
      <Card className="w-full max-w-lg border border-gray-800 bg-black shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Premium Access
          </CardTitle>
          <CardDescription className="text-gray-400 text-lg">
            Unlock advanced protection features
          </CardDescription>
          
          <div className="py-2">
            <Badge 
              variant="outline" 
              className="px-4 py-1 text-red-400 border-red-800 bg-black/50"
            >
              $25 in Litecoin
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Premium Benefits */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Premium Features</h3>
            <ul className="space-y-2">
              {[
                "Advanced executable protection",
                "Anti-debugging and anti-dumping",
                "Self-defending code modifications",
                "Custom icons and branding",
                "Domain locking for executables",
                "DLL injection protection",
                "Runtime string encryption"
              ].map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Instructions */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-900 rounded-md border border-gray-700">
              <h3 className="text-md font-semibold text-white mb-2">Payment Instructions:</h3>
              <ol className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="flex items-center justify-center rounded-full bg-red-900/30 text-red-400 w-5 h-5 mr-2 flex-shrink-0 text-xs">1</span>
                  <span>Send <span className="font-semibold text-white">$25 worth of Litecoin (LTC)</span> to the address below</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center rounded-full bg-red-900/30 text-red-400 w-5 h-5 mr-2 flex-shrink-0 text-xs">2</span>
                  <span>Copy your transaction ID from your wallet or exchange</span>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center rounded-full bg-red-900/30 text-red-400 w-5 h-5 mr-2 flex-shrink-0 text-xs">3</span>
                  <span>Enter the transaction ID below and verify</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-gray-400">Litecoin (LTC) Address:</label>
              <div className="flex">
                <div className="bg-gray-900 border border-gray-700 rounded-l-md px-3 py-2 flex-grow text-gray-300 font-mono text-sm">
                  {walletAddress}
                </div>
                <Button 
                  onClick={handleCopyAddress} 
                  className="rounded-l-none bg-gray-800 hover:bg-gray-700 border border-gray-700"
                >
                  {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-amber-400 text-sm font-medium">
                Time remaining: {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Transaction ID input */}
          <div className="space-y-4">
            <label className="text-sm text-gray-400">
              {status === 'failed' ? (
                <span className="flex items-center text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Transaction verification failed. Try again.
                </span>
              ) : (
                "Enter your Transaction ID or Admin code:"
              )}
            </label>
            
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Transaction ID or Admin code"
              className="bg-gray-900 border-gray-700 text-white"
              disabled={status === 'success' || status === 'verifying'}
            />
            
            <div className="flex space-x-3">
              <Button 
                onClick={handleVerifyTransaction} 
                className="flex-1 bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-lg shadow-red-700/30"
                disabled={isSubmitting || transactionId.length < 10 || status === 'success'}
              >
                {status === 'verifying' ? "Verifying..." : 
                 status === 'success' ? "Verified!" : "Verify Transaction"}
              </Button>
              
              <Button 
                onClick={handleAdminBypass}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
                disabled={isSubmitting || status === 'success'}
              >
                Admin
              </Button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button 
            variant="outline"
            onClick={() => setLocation('/')} 
            className="w-full sm:w-auto border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            Continue with Free Version
          </Button>
          
          <Button 
            variant="link"
            onClick={() => setLocation('/login')} 
            className="text-red-400 hover:text-red-300"
          >
            Already Premium? Login
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}