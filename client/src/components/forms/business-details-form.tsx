import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

const businessSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  address: z.string().min(5, 'Please enter a valid address'),
  gstNumber: z.string().optional()
});

type BusinessFormData = z.infer<typeof businessSchema>;

const BusinessDetailsForm = ({ onBack, personalDetails }: { onBack: () => void; personalDetails: any }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema)
  });
  const [, navigate] = useLocation();

  const registerSellerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        'POST',
        '/api/seller/register',
        {
          personalDetails,
          businessDetails: data
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast.success('Registration successful!');
      navigate('/seller/dashboard');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
    }
  });

  const onSubmit = (data: any) => {
    registerSellerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register('businessName')}
          placeholder="Business Name"
          className={errors.businessName ? 'border-red-500' : ''}
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm">{errors.businessName.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Textarea
          {...register('address')}
          placeholder="Business Address"
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Input
          {...register('gstNumber')}
          placeholder="GST Number (Optional)"
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={registerSellerMutation.isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          disabled={registerSellerMutation.isLoading}
        >
          {registerSellerMutation.isLoading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default BusinessDetailsForm;
