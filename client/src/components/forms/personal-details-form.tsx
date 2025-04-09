import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PersonalDetailsForm = ({ onNext, setPersonalDetails }: { onNext: () => void; setPersonalDetails: (data: any) => void }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    setPersonalDetails(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register('firstName')} placeholder="First Name" required />
      <Input {...register('lastName')} placeholder="Last Name" required />
      <Input {...register('email')} type="email" placeholder="Email" required />
      <Input {...register('mobile')} type="tel" placeholder="Mobile Number" required />
      <Button type="submit" className="flex justify-end">Next</Button>
    </form>
  );
};

export default PersonalDetailsForm;
