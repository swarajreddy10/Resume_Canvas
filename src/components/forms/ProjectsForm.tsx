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
    mode: 'onBlur',
    reValidateMode: 'onChange',
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

  const watchedValues = useWatch({ control: form.control });

  // Update parent state when form values change (debounced for performance)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.formState.isDirty) {
        onSubmit(watchedValues as ProjectsArrayData);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [watchedValues, form.formState.isDirty, onSubmit]);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Project {index + 1}</CardTitle>
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
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  const charCount = field.value?.length || 0;
                  const isValid = charCount >= 5;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Technologies Used *</span>
                        <span
                          className={`text-xs ${isValid ? 'text-green-600' : charCount > 0 ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          {charCount}/5 min
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="React, Node.js, MongoDB, Express.js (comma-separated, minimum 5 characters)"
                          {...field}
                          value={
                            Array.isArray(field.value)
                              ? field.value.join(', ')
                              : field.value || ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                          className={
                            form.formState.errors.projects?.[index]
                              ?.technologies
                              ? 'border-red-500 focus:border-red-500'
                              : isValid
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
                  const isValid = charCount >= 50;
                  return (
                    <FormItem>
                      <FormLabel className="flex items-center justify-between">
                        <span>Description *</span>
                        <span
                          className={`text-xs ${isValid ? 'text-green-600' : charCount > 0 ? 'text-red-500' : 'text-gray-500'}`}
                        >
                          {charCount}/50 min
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the project, your role, and key features (minimum 50 characters). Example: Built a full-stack e-commerce platform with React frontend and Node.js backend, featuring user authentication, payment processing, and inventory management..."
                          {...field}
                          className={
                            form.formState.errors.projects?.[index]?.description
                              ? 'border-red-500 focus:border-red-500'
                              : isValid
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
