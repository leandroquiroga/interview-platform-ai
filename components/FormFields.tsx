import { Control, Controller } from 'react-hook-form';
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormFieldsProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  type: string;
}

const FormFields = ({
  control,
  name,
  label,
  placeholder,
  type,
}: FormFieldsProps) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            placeholder={placeholder}
            type={type}
            value={field.value || ''}
          />
        </FormControl>
        {error && <FormMessage>{error.message}</FormMessage>}
      </FormItem>
    )}
  />
);

export default FormFields;
