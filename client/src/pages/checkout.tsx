import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Wallet, Building, Truck, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const CheckoutPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState('');
  
  // Fetch cart items
  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: user ? ['/api/cart/items'] : [],
    enabled: !!user,
  });

  interface CartItem {
    id: string;
    product: {
      name: string;
      imageUrl?: string;
    };
    price: number;
    quantity: number;
  }
  
  // Calculate cart total (assuming item.price is in paise)
  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/auth-page?redirect=checkout');
    }
    
    // Redirect if cart is empty
    if (cartItems.length === 0 && !isLoading) {
      navigate('/');
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty. Add some products before checkout.',
        variant: 'destructive'
      });
    }
  }, [user, cartItems, isLoading, navigate, toast]);
  
  const handlePaymentMethodChange = (value: string): void => {
    setPaymentMethod(value);
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setAddress(e.target.value);
  };
  
  const handleCheckout = async () => {
    if (!address.trim()) {
      toast({
        title: 'Missing Address',
        description: 'Please provide a delivery address',
        variant: 'destructive'
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 1. Create order
      const orderResponse = await apiRequest('POST', '/api/orders', {
        address,
        totalPrice: cartTotal // Send total in paise
      });
      
      const orderData = await orderResponse.json();
      
      // 2. Process payment
      const paymentResponse = await apiRequest('POST', '/api/payments', {
        orderId: orderData.order.id,
        method: paymentMethod,
        amount: cartTotal // Send total in paise
      });
      
      const paymentData = await paymentResponse.json();
      
      // 3. Clear cart
      await apiRequest('POST', '/api/cart/clear', {});
      
      // 4. Redirect to success page
      navigate(`/order-success?orderId=${orderData.order.id}`);
      
      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${orderData.order.id} has been placed successfully.`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error instanceof Error ? error.message : 'Failed to process your order. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Review your items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-16 w-16 rounded-md overflow-hidden">
                          <img 
                            src={item.product.imageUrl || '/placeholder.png'} 
                            alt={item.product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{(cartTotal / 100).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p>Subtotal</p>
                    <p className="font-medium">₹{(cartTotal / 100).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Shipping</p>
                    <p className="font-medium">₹0.00</p>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-bold">
                    <p>Total</p>
                    <p>₹{(cartTotal / 100).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
                <CardDescription>Enter your delivery address</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input 
                        id="address" 
                        placeholder="Enter your full address" 
                        value={address}
                        onChange={handleAddressChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Method */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                      <Wallet className="h-5 w-5 mr-2 text-blue-500" />
                      <span>PayPal</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label htmlFor="bank_transfer" className="flex items-center cursor-pointer">
                      <Building className="h-5 w-5 mr-2 text-gray-700" />
                      <span>Bank Transfer</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 rounded-md border p-3">
                    <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                    <Label htmlFor="cash_on_delivery" className="flex items-center cursor-pointer">
                      <Truck className="h-5 w-5 mr-2 text-green-600" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
                
                {paymentMethod === 'credit_card' && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="card_number">Card Number</Label>
                      <Input id="card_number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Complete Order
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;