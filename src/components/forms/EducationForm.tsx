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
import { EducationSchema } from '@/lib/validation/resume.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const EducationArraySchema = z.object({
  education: z.array(EducationSchema),
});

type EducationArrayData = z.infer<typeof EducationArraySchema>;

interface EducationFormProps {
  initialData?: EducationArrayData;
  onSubmit: (data: EducationArrayData) => void;
}

export default function EducationForm({
  initialData,
  onSubmit,
}: EducationFormProps) {
  const form = useForm<EducationArrayData>({
    resolver: zodResolver(EducationArraySchema),
    mode: 'onChange',
    defaultValues: initialData || {
      education: [
        {
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          gpa: '',
          location: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'education',
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
        onSubmit(watchedValues as EducationArrayData);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, form.formState.isDirty, form.formState.isValid, onSubmit]);

  const addEducation = () => {
    append({
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      location: '',
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
                Education {index + 1}
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
                  name={`education.${index}.school`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School/University *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Stanford University"
                          {...field}
                          className={
                            form.formState.errors.education?.[index]?.school
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
                  name={`education.${index}.degree`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bachelor of Science"
                          {...field}
                          className={
                            form.formState.errors.education?.[index]?.degree
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
                  name={`education.${index}.field`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Computer Science"
                          {...field}
                          className={
                            form.formState.errors.education?.[index]?.field
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
                  name={`education.${index}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Stanford, CA"
                          {...field}
                          className={
                            form.formState.errors.education?.[index]?.location
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-2">
                  <DateField
                    control={form.control}
                    name={`education.${index}.startDate`}
                    label="Start Date"
                    placeholder="Pick start date"
                    required={true}
                  />

                  <DateField
                    control={form.control}
                    name={`education.${index}.endDate`}
                    label="End Date"
                    placeholder="Present"
                    allowPresent={true}
                    required={true}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`education.${index}.gpa`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPA (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="8.5/10 or 3.8/4.0"
                          {...field}
                          className={
                            form.formState.errors.education?.[index]?.gpa
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
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addEducation}>
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </Button>
      </form>
    </Form>
  );
}
