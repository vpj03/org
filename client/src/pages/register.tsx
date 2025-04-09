import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import PersonalDetailsForm from '@/components/forms/personal-details-form';
import BusinessDetailsForm from '@/components/forms/business-details-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { Button } from '@/components/ui/button';

const queryClient = new QueryClient();

const RegisterPage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSeller, setIsSeller] = useState(false);
  const [personalDetails, setPersonalDetails] = useState(null);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'seller') {
        navigate('/seller');
      } else if (user.role === 'buyer') {
        navigate('/buyer');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handlePersonalDetailsSubmit = (details: any) => {
    setPersonalDetails(details);
    if (isSeller) {
      setStep(2);
    } else {
      // Handle buyer registration directly
      // TODO: Implement buyer registration API call
      console.log('Registering buyer:', { ...details, role: 'buyer' });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {isSeller ? 'Become a Seller on OrgPick' : 'Create Your Account'}
          </h1>
          <p className="text-gray-600">
            {isSeller
              ? 'Join our marketplace and start selling your organic products today'
              : 'Join OrgPick to start shopping for organic products'}
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsSeller(!isSeller)}
              className="text-sm"
            >
              {isSeller ? 'Switch to Buyer Registration' : 'Switch to Seller Registration'}
            </Button>
          </div>
        </div>
        {step === 1 ? (
          <PersonalDetailsForm
            onNext={handlePersonalDetailsSubmit}
          />
        ) : (
          <BusinessDetailsForm
            onBack={() => setStep(1)}
            personalDetails={personalDetails}
          />
        )}
      </div>
    </div>
  );
};

export default function WrappedRegisterPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster />
        <RegisterPage />
      </AuthProvider>
    </QueryClientProvider>
  );
}