'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Check } from 'lucide-react';
import {
  PersonalInfoFormData,
  PersonalInfoSchema,
  VALIDATION_LIMITS,
} from '@/lib/validation/resume.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface PersonalInfoFormProps {
  initialData?: PersonalInfoFormData;
  onSubmit: (data: PersonalInfoFormData) => void;
}

export default function PersonalInfoForm({
  initialData,
  onSubmit,
}: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(PersonalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: '',
      summary: '',
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const watchedValues = useWatch({ control: form.control });

  // Update parent state when form values change (debounced for performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only submit if form is valid (no validation errors)
      if (form.formState.isDirty && form.formState.isValid) {
        onSubmit(watchedValues as PersonalInfoFormData);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, form.formState.isDirty, form.formState.isValid, onSubmit]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className={
                        form.formState.errors.name
                          ? 'border-red-500 focus:border-red-500'
                          : field.value && !form.formState.errors.name
                            ? 'border-green-500'
                            : ''
                      }
                    />
                    {field.value &&
                      !form.formState.errors.name &&
                      form.formState.touchedFields.name && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                      className={
                        form.formState.errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : field.value && !form.formState.errors.email
                            ? 'border-green-500'
                            : ''
                      }
                    />
                    {field.value &&
                      !form.formState.errors.email &&
                      form.formState.touchedFields.email && (
                        <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                      )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    {...field}
                    className={
                      form.formState.errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Bangalore, Karnataka"
                    {...field}
                    className={
                      form.formState.errors.address
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/johndoe"
                    {...field}
                    className={
                      form.formState.errors.linkedin
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/johndoe"
                    {...field}
                    className={
                      form.formState.errors.github
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://johndoe.com"
                    {...field}
                    className={
                      form.formState.errors.website
                        ? 'border-red-500 focus:border-red-500'
                        : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => {
            const charCount = field.value?.length || 0;
            const hasError =
              charCount > 0 && charCount < VALIDATION_LIMITS.summary.min;
            return (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Professional Summary *</FormLabel>
                  {hasError && (
                    <span className="text-xs text-red-500">
                      {charCount}/{VALIDATION_LIMITS.summary.min} min
                    </span>
                  )}
                </div>
                <FormControl>
                  <Textarea
                    placeholder={`Brief summary of your professional background and key achievements (minimum ${VALIDATION_LIMITS.summary.min} characters)...`}
                    className={`min-h-[100px] ${hasError ? 'border-red-500 focus:border-red-500' : ''}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
    </Form>
  );
}
