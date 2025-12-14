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
  ExperienceArrayData,
  ExperienceArraySchema,
} from '@/lib/validation/resume.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Sparkles, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface ExperienceFormProps {
  initialData?: ExperienceArrayData;
  onSubmit: (data: ExperienceArrayData) => void;
}

export default function ExperienceForm({
  initialData,
  onSubmit,
}: ExperienceFormProps) {
  const form = useForm({
    resolver: zodResolver(ExperienceArraySchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      experiences: [
        {
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
          bullets: ['', ''],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'experiences',
  });

  // Update parent state when form values change (debounced for performance)
  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const subscription = form.watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (form.formState.isDirty) {
          onSubmit(value as ExperienceArrayData);
        }
      }, 300);
    });
    return () => {
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, [form, onSubmit]);

  const addExperience = () => {
    append({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      bullets: ['', ''],
    });
  };

  const addBullet = (experienceIndex: number) => {
    const currentBullets =
      form.getValues(`experiences.${experienceIndex}.bullets`) || [];
    if (currentBullets.length >= 5) {
      alert('Maximum 5 bullet points allowed per experience');
      return;
    }
    form.setValue(`experiences.${experienceIndex}.bullets`, [
      ...currentBullets,
      '',
    ]);
    // Force re-render
    form.trigger(`experiences.${experienceIndex}.bullets`);
  };

  const [generatingAI, setGeneratingAI] = React.useState<number | null>(null);

  const generateAIBullets = async (experienceIndex: number) => {
    const experience = form.getValues(`experiences.${experienceIndex}`);

    if (
      !experience?.position ||
      !experience?.company ||
      !experience?.description
    ) {
      alert('Please fill in position, company, and description first');
      return;
    }

    setGeneratingAI(experienceIndex);
    try {
      const response = await fetch('/api/ai/generate-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: experience?.position || '',
          company: experience?.company || '',
          description: experience?.description || '',
        }),
      });

      const data = await response.json();
      if (data.bulletPoints) {
        // Limit to 5 bullet points max
        const limitedBullets = data.bulletPoints.slice(0, 5);
        form.setValue(`experiences.${experienceIndex}.bullets`, limitedBullets);

        // Show success message with count
        const toast = document.createElement('div');
        toast.className =
          'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
        toast.textContent = `Generated ${limitedBullets.length} bullet points!`;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    } catch (error) {
      console.error('Failed to generate AI bullets:', error);
      alert('Failed to generate bullet points. Please try again.');
    } finally {
      setGeneratingAI(null);
    }
  };

  const removeBullet = (experienceIndex: number, bulletIndex: number) => {
    const currentBullets =
      form.getValues(`experiences.${experienceIndex}.bullets`) || [];
    const newBullets = currentBullets.filter(
      (_, index) => index !== bulletIndex
    );
    form.setValue(`experiences.${experienceIndex}.bullets`, newBullets);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, experienceIndex) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                Experience {experienceIndex + 1}
              </CardTitle>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(experienceIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`experiences.${experienceIndex}.company`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Google"
                          {...field}
                          className={
                            form.formState.errors.experiences?.[experienceIndex]
                              ?.company
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
                  name={`experiences.${experienceIndex}.position`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Software Engineer"
                          {...field}
                          className={
                            form.formState.errors.experiences?.[experienceIndex]
                              ?.position
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
                  name={`experiences.${experienceIndex}.location`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="San Francisco, CA"
                          {...field}
                          className={
                            form.formState.errors.experiences?.[experienceIndex]
                              ?.location
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
                    name={`experiences.${experienceIndex}.startDate`}
                    label="Start Date"
                    placeholder="Pick start date"
                    required={true}
                  />

                  <DateField
                    control={form.control}
                    name={`experiences.${experienceIndex}.endDate`}
                    label="End Date"
                    placeholder="Present"
                    allowPresent={true}
                    required={true}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name={`experiences.${experienceIndex}.description`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your role and responsibilities..."
                        {...field}
                        className={
                          form.formState.errors.experiences?.[experienceIndex]
                            ?.description
                            ? 'border-red-500 focus:border-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel>Key Achievements</FormLabel>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => generateAIBullets(experienceIndex)}
                      disabled={generatingAI === experienceIndex}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
                    >
                      {generatingAI === experienceIndex ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-1" />
                      )}
                      {generatingAI === experienceIndex
                        ? 'Generating...'
                        : 'AI Generate (5 bullets)'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addBullet(experienceIndex)}
                      disabled={
                        (
                          form.getValues(
                            `experiences.${experienceIndex}.bullets`
                          ) || []
                        ).length >= 5
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Bullet (
                      {
                        (
                          form.getValues(
                            `experiences.${experienceIndex}.bullets`
                          ) || []
                        ).length
                      }
                      /5)
                    </Button>
                  </div>
                </div>

                {(
                  form.getValues(`experiences.${experienceIndex}.bullets`) || []
                ).map((_, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`experiences.${experienceIndex}.bullets.${bulletIndex}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="• Achieved 25% increase in team productivity..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {(
                      form.getValues(
                        `experiences.${experienceIndex}.bullets`
                      ) || []
                    ).length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          removeBullet(experienceIndex, bulletIndex)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button type="button" variant="outline" onClick={addExperience}>
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </Button>
      </form>
    </Form>
  );
}
