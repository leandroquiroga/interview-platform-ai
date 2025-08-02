import { Controller, Control } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';

interface FormFieldsOTPProps {
  control: Control<any>;
  name: string;
  label: string;
}

const FormFieldsOTP = ({ control, label, name }: FormFieldsOTPProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="w-full flex flex-col justify-center items-center space-y-2">
        <FormLabel className="text-lg">{label}</FormLabel>
        <FormControl>
          <InputOTP
            maxLength={6}
            value={field.value || ''}
            onChange={value => {
              field.onChange(value);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
        <FormDescription>
          Please enter the one-time password sent to your email.
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormFieldsOTP;
