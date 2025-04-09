import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import ResetPassword from '@/components/auth/reset-password';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const ResetPasswordPage = () => {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  
  // Extract token from URL query parameters
  const params = new URLSearchParams(location.split('?')[1]);
  const token = params.get('token');
  
  // Verify token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }
      
      try {
        // Call the token verification endpoint
        const response = await apiRequest('GET', `/api/auth/reset-password/verify?token=${token}`, undefined);
        const data = await response.json();
        
        if (data.valid) {
          setIsValidToken(true);
        }
      } catch (error) {
        toast({
          title: "Invalid or expired token",
          description: "The password reset link is invalid or has expired.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyToken();
  }, [token, toast]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8">
        <div className="mb-6 text-center">
          <a href="/" className="flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5,9.5C15.5,6.5 13.1,4 10,4C6.9,4 4.5,6.5 4.5,9.5C4.5,12.5 6.9,15 10,15C13.1,15 15.5,12.5 15.5,9.5M12,10.5H8V9H12M12,7.5H8V6H12M19.5,9.5C19.5,6.5 17.1,4 14,4C13.4,4 12.8,4.1 12.2,4.3C13.2,5.3 13.8,6.7 13.8,8.2C13.8,9.7 13.2,11.1 12.2,12.1C12.8,12.3 13.4,12.4 14,12.4C17.1,12.4 19.5,9.9 19.5,9.5M14,15C13.8,15 13.5,15 13.3,14.9C14.1,13.5 14.5,11.8 14.5,10C14.5,8.2 14.1,6.5 13.3,5.1C13.5,5 13.8,5 14,5C17.4,5 20,7.6 20,11C20,13 17.4,15 14,15" />
            </svg>
            <span className="ml-2 text-xl font-bold text-primary font-heading">OrgPick</span>
          </a>
        </div>
        
        {isVerifying ? (
          <div className="text-center py-8">
            <p>Verifying reset link...</p>
          </div>
        ) : (
          isValidToken ? (
            <ResetPassword token={token || undefined} />
          ) : (
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
              <p className="text-sm text-gray-500 mb-4">
                The password reset link is invalid or has expired.
              </p>
              <button 
                onClick={() => navigate('/auth')} 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Back to Login
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;