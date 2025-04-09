import React, { useEffect } from "react";
import { useLocation } from 'wouter';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import SellerRegistrationForm from "@/components/forms/seller-registration-form";

const SellerRegistrationPage = () => {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect to seller dashboard if already registered as a seller
    if (user?.role === 'seller') {
      navigate('/seller/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl bg-white rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-primary mb-6">Seller Registration</h1>
        <SellerRegistrationForm />
      </div>
    </div>
  );
};

export default function WrappedSellerRegistrationPage() {
  return (
    <AuthProvider>
      <SellerRegistrationPage />
    </AuthProvider>
  );
}
