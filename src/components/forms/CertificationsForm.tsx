'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateField } from '@/components/ui/date-field';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  CertificationsArrayData,
  CertificationsArraySchema,
} from '@/lib/validation/resume.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

interface CertificationsFormProps {
  initialData?: CertificationsArrayData;
  onSubmit: (data: CertificationsArrayData) => void;
}

export default function CertificationsForm({
  initialData,
  onSubmit,
}: CertificationsFormProps) {
  const form = useForm({
    resolver: zodResolver(CertificationsArraySchema),
    mode: 'onChange',
    defaultValues: initialData || {
      certifications: [
        {
          name: '',
          issuer: '',
          date: '',
          url: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'certifications',
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
      if (form.formState.isDirty && form.formState.isValid) {
        onSubmit(watchedValues as CertificationsArrayData);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, form.formState.isDirty, form.formState.isValid, onSubmit]);

  const addCertification = () => {
    append({
      name: '',
      issuer: '',
      date: '',
      url: '',
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between py-3 sm:py-6">
              <CardTitle className="text-base sm:text-lg">
                Certification {index + 1}
              </CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <FormField
                  control={form.control}
                  name={`certifications.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="AWS Certified Solutions Architect"
                          {...field}
                          className={
                            form.formState.errors.certifications?.[index]?.name
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
                  name={`certifications.${index}.issuer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issuing Organization *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Amazon Web Services"
                          {...field}
                          className={
                            form.formState.errors.certifications?.[index]
                              ?.issuer
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DateField
                  control={form.control}
                  name={`certifications.${index}.date`}
                  label="Date Obtained"
                  placeholder="Pick date"
                />

                <FormField
                  control={form.control}
                  name={`certifications.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://..."
                          {...field}
                          className={
                            form.formState.errors.certifications?.[index]?.url
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                          onBlur={() => {
                            field.onBlur();
                            form.trigger(`certifications.${index}.url`);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addCertification}>
          <Plus className="h-4 w-4 mr-1" />
          Add Certification
        </Button>
      </form>
    </Form>
  );
}
