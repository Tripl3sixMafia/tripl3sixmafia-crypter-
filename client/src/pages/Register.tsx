import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from 'wouter';
import { ArrowLeft, Shield, ShieldCheck } from "lucide-react";

// Use the schema directly
const userRegistrationSchema = registerUserSchema;

export default function Register() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Register form
  const form = useForm<z.infer<typeof userRegistrationSchema>>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    },
  });

  // Handle registration submission
  const onSubmit = async (data: z.infer<typeof userRegistrationSchema>) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/register', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setUserEmail(data.email);
      setVerificationSent(true);
      toast({
        title: "Registration successful!",
        description: "Please check your email for a verification code.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle verification code submission
  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, code: verificationCode }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      toast({
        title: "Verification successful!",
        description: "Your account has been verified. You can now log in.",
        variant: "default",
      });
      
      // Redirect to login page
      setLocation('/login');
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
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
            {verificationSent ? "Verify Your Email" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {verificationSent 
              ? "Enter the 6-digit code sent to your email" 
              : "Join Dlinqnt Shield to protect your source code"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!verificationSent ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your full name" 
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
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
                          placeholder="Create a password" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
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
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center text-lg tracking-wider bg-gray-900 border-gray-700 text-white"
                maxLength={6}
              />
              
              <Button 
                onClick={handleVerify} 
                className="w-full bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-lg shadow-red-700/30"
                disabled={isSubmitting || verificationCode.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Verify Account"}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-400 text-center">
            {verificationSent ? 
              "Didn't receive the code? Check your spam folder or request a new code." : 
              "Already have an account?"}
          </div>
          <Button 
            variant="outline"
            onClick={() => verificationSent ? setVerificationSent(false) : setLocation('/login')} 
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {verificationSent ? "Back to Registration" : "Back to Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}