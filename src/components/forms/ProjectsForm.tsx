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
import { Textarea } from '@/components/ui/textarea';
import {
  ProjectsArrayData,
  ProjectsArraySchema,
  VALIDATION_LIMITS,
} from '@/lib/validation/resume.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

interface ProjectsFormProps {
  initialData?: ProjectsArrayData;
  onSubmit: (data: ProjectsArrayData) => void;
}

export default function ProjectsForm({
  initialData,
  onSubmit,
}: ProjectsFormProps) {
  const form = useForm({
    resolver: zodResolver(ProjectsArraySchema),
    mode: 'onChange',
    defaultValues: initialData || {
      projects: [
        {
          name: '',
          description: '',
          technologies: '',
          url: '',
          startDate: '',
          endDate: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'projects',
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
        onSubmit(watchedValues as ProjectsArrayData);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, form.formState.isDirty, form.formState.isValid, onSubmit]);

  const addProject = () => {
    append({
      name: '',
      description: '',
      technologies: '',
      url: '',
      startDate: '',
      endDate: '',
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
                Project {index + 1}
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
                  name={`projects.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E-commerce Platform"
                          {...field}
                          className={
                            form.formState.errors.projects?.[index]?.name
                              ? 'border-red-500 focus:border-red-500'
                              : field.value && field.value.length > 0
                                ? 'border-green-500 focus:border-green-500'
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
                  name={`projects.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/..."
                          {...field}
                          className={
                            form.formState.errors.projects?.[index]?.url
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                          onBlur={() => {
                            field.onBlur();
                            form.trigger(`projects.${index}.url`);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DateField
                  control={form.control}
                  name={`projects.${index}.startDate`}
                  label="Start Date"
                  placeholder="Pick start date"
                />

                <DateField
                  control={form.control}
                  name={`projects.${index}.endDate`}
                  label="End Date"
                  placeholder="Present"
                  allowPresent={true}
                />
              </div>

              <FormField
                control={form.control}
                name={`projects.${index}.technologies`}
                render={({ field }) => {
                  const hasError =
                    !!form.formState.errors.projects?.[index]?.technologies;
                  return (
                    <FormItem>
                      <FormLabel>Technologies Used *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, Node.js, MongoDB, Express.js"
                          {...field}
                          value={
                            Array.isArray(field.value)
                              ? field.value.join(', ')
                              : field.value || ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          className={
                            hasError
                              ? 'border-red-500 focus:border-red-500'
                              : field.value && field.value.length >= 5
                                ? 'border-green-500 focus:border-green-500'
                                : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name={`projects.${index}.description`}
                render={({ field }) => {
                  const charCount = field.value?.length || 0;
                  const hasError =
                    charCount > 0 &&
                    charCount < VALIDATION_LIMITS.description.min;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Description *</span>
                        {hasError && (
                          <span className="text-xs text-red-500">
                            {charCount}/{VALIDATION_LIMITS.description.min} min
                          </span>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Detailed description of the project, your role, and key features (minimum ${VALIDATION_LIMITS.description.min} characters). Example: Built a full-stack e-commerce platform with React frontend and Node.js backend...`}
                          {...field}
                          className={
                            hasError
                              ? 'border-red-500 focus:border-red-500'
                              : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addProject}>
          <Plus className="h-4 w-4 mr-1" />
          Add Project
        </Button>
      </form>
    </Form>
  );
}
