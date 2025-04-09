import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const SubscribeSection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // This would normally connect to an API endpoint
    setTimeout(() => {
      toast({
        title: 'Thank you!',
        description: 'You have successfully subscribed to our newsletter',
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-heading mb-4">Join Our Organic Community</h2>
          <p className="text-white/90 mb-8">Subscribe to receive updates on new products, special offers, and health tips!</p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg text-textDark focus:outline-none"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-lg font-medium transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;
