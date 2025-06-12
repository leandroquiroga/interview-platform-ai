import React from 'react';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from './ui/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

type FormFieldType = 'text' | 'email' | 'password' | 'file';
interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type: FormFieldType;
}

const FormFields = <T extends FieldValues>({
  control,
  label,
  name,
  type = 'text',
  placeholder,
}: FormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input
            className="input"
            placeholder={placeholder}
            {...field}
            type={type}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
export default FormFields;
