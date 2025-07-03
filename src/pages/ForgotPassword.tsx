
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { db } from '@/utils/database';
import { emailService } from '@/utils/emailService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists
      const user = db.getUserByEmail(email);
      if (!user) {
        toast({
          title: "Email not found",
          description: "No account found with this email address.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Generate reset token
      const resetToken = db.generateResetToken(email);
      if (!resetToken) {
        toast({
          title: "Error",
          description: "Failed to generate reset token. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Send password reset email
      const emailSent = await emailService.sendPasswordResetEmail(email, resetToken);
      
      if (emailSent) {
        setEmailSent(true);
        toast({
          title: "Email sent!",
          description: "Please check your email for password reset instructions.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ShoppingCart className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            FriendlyMart Supermarket
          </CardTitle>
          <CardDescription>
            {emailSent ? 'Check your email' : 'Reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="text-green-600 text-lg font-medium">
                Email sent successfully!
              </div>
              <p className="text-gray-600">
                We've sent password reset instructions to {email}
              </p>
              <p className="text-sm text-gray-500">
                Please check your email and follow the instructions to reset your password.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Email'}
              </Button>
              
              <div className="text-center">
                <Link to="/login">
                  <Button variant="ghost" className="text-sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
