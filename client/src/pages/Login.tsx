import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import { ArrowRight, Shield, ShieldCheck, Lock } from "lucide-react";

// Use the schema directly
const userLoginSchema = loginSchema;

export default function Login() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [adminCode, setAdminCode] = useState('');

  // Login form
  const form = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login submission
  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Login successful!",
        description: "Welcome back to Dlinqnt Shield.",
        variant: "default",
      });
      
      // Redirect to home page
      setLocation('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle admin bypass code
  const handleAdminBypass = async () => {
    if (adminCode !== "tripl3six6mafia") {
      toast({
        title: "Invalid bypass code",
        description: "The bypass code you entered is incorrect",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/admin-premium', {
        method: 'POST',
        body: JSON.stringify({ code: adminCode }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Admin access granted",
        description: "Welcome to Dlinqnt Shield admin panel.",
        variant: "default",
      });
      
      // Redirect to home page with admin access
      setLocation('/');
    } catch (error) {
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
      <Card className="w-full max-w-md border border-gray-800 bg-black shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            {showAdminCode ? "Admin Access" : "Sign In"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {showAdminCode 
              ? "Enter the admin bypass code to continue" 
              : "Access your Dlinqnt Shield account"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!showAdminCode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="bg-gray-900 border-gray-700 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="bg-gray-900 border-gray-700 text-white" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-lg shadow-red-700/30"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Input
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                type="password"
                placeholder="Enter admin bypass code"
                className="bg-gray-900 border-gray-700 text-white"
              />
              
              <Button 
                onClick={handleAdminBypass} 
                className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-lg shadow-red-700/30"
                disabled={isSubmitting || adminCode.length < 6}
              >
                {isSubmitting ? "Verifying..." : "Access Admin Panel"}
              </Button>
            </div>
          )}

          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-black text-gray-400">Or</span>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-700"></span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
            onClick={() => setShowAdminCode(!showAdminCode)}
          >
            <Lock className="mr-2 h-4 w-4" />
            {showAdminCode ? "Back to Login" : "Admin Access"}
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-400 text-center">
            Don't have an account yet?
          </div>
          <Button 
            variant="outline"
            onClick={() => setLocation('/register')} 
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            Create an Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}