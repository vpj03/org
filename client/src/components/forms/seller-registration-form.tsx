import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLocation } from "wouter"; // Using wouter for routing
import { apiRequest } from '@/lib/queryClient'; // Import apiRequest

// Form schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[0-9]{10}$/, 'Invalid mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const businessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.enum(['Individual', 'Sole Proprietor', 'Partnership', 'Private Limited', 'LLP']),
  streetAddress: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[0-9]{6}$/, 'Invalid pincode'),
  gstNumber: z.string().optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number'),
  fssaiLicense: z.string().optional(),
});

const storeDetailsSchema = z.object({
  storeName: z.string().min(2, 'Store name is required'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  brandName: z.string().optional(),
  stockCount: z.number().min(0, 'Stock count cannot be negative'),
});

const bankDetailsSchema = z.object({
  accountHolderName: z.string().min(2, 'Account holder name is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  accountNumber: z.string().min(9, 'Invalid account number'),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  cancelledCheque: z.any(), // File upload will be handled separately
});

const shippingDetailsSchema = z.object({
  pickupAddress: z.string().min(5, 'Pickup address is required'),
  courierPartner: z.string().optional(),
  returnPolicy: z.string().min(10, 'Return policy description is required'),
});

const documentsSchema = z.object({
  aadharCard: z.any(), // File upload
  businessCertificate: z.any(), // File upload
  tradeLicense: z.any(), // File upload
});

const agreementsSchema = z.object({
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
  marketplacePolicies: z.boolean().refine((val) => val === true, 'You must accept the policies'),
  paymentProcessing: z.boolean().refine((val) => val === true, 'You must accept the payment processing terms'),
});

type FormData = z.infer<typeof personalInfoSchema> &
  z.infer<typeof businessInfoSchema> &
  z.infer<typeof storeDetailsSchema> &
  z.infer<typeof bankDetailsSchema> &
  z.infer<typeof shippingDetailsSchema> &
  z.infer<typeof documentsSchema> &
  z.infer<typeof agreementsSchema>;

const SellerRegistrationForm = () => {
  const [, setLocation] = useLocation(); // Using wouter's location hook
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({}); // Store all form data

  const form = useForm<FormData>({
    resolver: zodResolver(personalInfoSchema), // Initial step schema
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      businessType: 'Individual',
      streetAddress: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      panNumber: '',
      fssaiLicense: '',
      storeName: '',
      categories: [],
      brandName: '',
      stockCount: 0,
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      pickupAddress: '',
      courierPartner: '',
      returnPolicy: '',
      termsAccepted: false,
      marketplacePolicies: false,
      paymentProcessing: false,
    },
  });

  const onSubmit = async (data: Partial<FormData>) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    if (step < 7) {
      setStep(step + 1);
      // Update form resolver based on current step
      switch (step + 1) {
        case 2:
          form.clearErrors();
          form.setFocus('businessName');
          break;
        case 3:
          form.clearErrors();
          form.setFocus('storeName');
          break;
        case 4:
          form.clearErrors();
          form.setFocus('accountHolderName');
          break;
        case 5:
          form.clearErrors();
          form.setFocus('pickupAddress');
          break;
        case 6:
          form.clearErrors();
          break;
        case 7:
          form.clearErrors();
          break;
      }
    } else {
      try {
        // Submit the complete form data to the API
        const personalDetails = {
          firstName: updatedFormData.firstName,
          lastName: updatedFormData.lastName,
          email: updatedFormData.email,
          mobile: updatedFormData.mobile
        };
        
        const businessDetails = {
          businessName: updatedFormData.businessName,
          address: updatedFormData.streetAddress,
          city: updatedFormData.city,
          state: updatedFormData.state,
          pincode: updatedFormData.pincode,
          gstNumber: updatedFormData.gstNumber,
          panNumber: updatedFormData.panNumber
        };
        
        const response = await apiRequest( // Use apiRequest
          'POST',
          '/api/seller/register',
          {
            personalDetails,
            businessDetails
          }
        );
        
        console.log('Form submitted successfully:', updatedFormData);
        setLocation("/seller"); // Redirect after successful registration using wouter
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormDescription>For verification and communication</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="10-digit mobile number" {...field} />
                  </FormControl>
                  <FormDescription>For OTP verification</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Create password" {...field} />
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Business Information</h2>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Official business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Sole Proprietor">Sole Proprietor</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Private Limited">Private Limited</SelectItem>
                      <SelectItem value="LLP">LLP</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gstNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GST Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="GST number if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="panNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter PAN number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fssaiLicense"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FSSAI License (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="FSSAI license if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Store & Product Details</h2>
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Display name for your store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Categories</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {['Vegetables', 'Fruits', 'Oils', 'Dry Fruits'].map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value.includes(category)}
                            onCheckedChange={(checked) => {
                              const updatedCategories = checked
                                ? [...field.value, category]
                                : field.value.filter((val: string) => val !== category);
                              field.onChange(updatedCategories);
                            }}
                          />
                          <Label>{category}</Label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brandName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your brand name if applicable" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stockCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Stock Count</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Estimated number of items"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Bank Account Details</h2>
            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name as per bank account" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IFSC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cancelledCheque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Cancelled Cheque</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,.pdf" {...field} />
                  </FormControl>
                  <FormDescription>Upload a scanned copy of cancelled cheque</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Shipping & Pickup Details</h2>
            <FormField
              control={form.control}
              name="pickupAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter pickup address if different from business address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courierPartner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Courier Partner (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter preferred courier partner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="returnPolicy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Policy</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your return policy"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Identity & Verification Documents</h2>
            <FormField
              control={form.control}
              name="aadharCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aadhar Card</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,.pdf" {...field} />
                  </FormControl>
                  <FormDescription>Upload Aadhar card for KYC verification</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessCertificate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Registration Certificate</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,.pdf" {...field} />
                  </FormControl>
                  <FormDescription>Upload business registration certificate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tradeLicense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trade License (Optional)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*,.pdf" {...field} />
                  </FormControl>
                  <FormDescription>Upload trade license if applicable</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Terms & Agreements</h2>
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the Terms & Conditions
                    </FormLabel>
                    <FormDescription>
                      By accepting, you agree to our terms of service and seller guidelines
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marketplacePolicies"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the Marketplace Policies
                    </FormLabel>
                    <FormDescription>
                      You agree to follow our marketplace guidelines and policies
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentProcessing"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I consent to Payment Processing
                    </FormLabel>
                    <FormDescription>
                      You agree to our payment processing terms and conditions
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {renderStep()}
        <div className="flex justify-end">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="mr-4" // Add margin to separate the buttons
            >
              Previous
            </Button>
          )}
          <Button type="submit">
            {step === 7 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SellerRegistrationForm; // Ensure the form is exported