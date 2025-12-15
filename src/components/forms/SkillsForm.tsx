'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SkillsSchema = z.object({
  skills: z.array(z.string().min(1, 'Skill cannot be empty')),
  newSkill: z.string().optional(),
});

type SkillsData = z.infer<typeof SkillsSchema>;

interface SkillsFormProps {
  initialData?: { skills: string[] };
  onSubmit: (data: { skills: string[] }) => void;
}

export default function SkillsForm({ initialData, onSubmit }: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);

  const form = useForm<SkillsData>({
    resolver: zodResolver(SkillsSchema),
    defaultValues: {
      skills: skills,
      newSkill: '',
    },
  });

  const addSkill = () => {
    const newSkill = form.getValues('newSkill')?.trim();
    if (newSkill && !skills.includes(newSkill)) {
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      form.setValue('skills', updatedSkills);
      form.setValue('newSkill', '');
      onSubmit({ skills: updatedSkills });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    form.setValue('skills', updatedSkills);
    onSubmit({ skills: updatedSkills });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Predefined skill suggestions
  const skillSuggestions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'HTML/CSS',
    'SQL',
    'Git',
    'AWS',
    'Docker',
    'MongoDB',
    'Next.js',
    'Express.js',
    'PostgreSQL',
    'Redis',
    'GraphQL',
    'Project Management',
    'Team Leadership',
    'Communication',
    'Problem Solving',
    'Agile/Scrum',
    'Data Analysis',
  ];

  const addSuggestedSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      form.setValue('skills', updatedSkills);
      onSubmit({ skills: updatedSkills });
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="newSkill"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add Skills</FormLabel>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Type a skill and press Enter"
                        {...field}
                        onKeyPress={handleKeyPress}
                      />
                    </FormControl>
                    <Button type="button" onClick={addSkill}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-600">
                    Or paste comma-separated skills:
                    <Input
                      placeholder="React, Node.js, Python, JavaScript, etc."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = (e.target as HTMLInputElement).value;
                          if (value.trim()) {
                            const newSkills = value
                              .split(',')
                              .map((s) => s.trim())
                              .filter((s) => s && !skills.includes(s));
                            if (newSkills.length > 0) {
                              const updatedSkills = [...skills, ...newSkills];
                              setSkills(updatedSkills);
                              form.setValue('skills', updatedSkills);
                              onSubmit({ skills: updatedSkills });
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Current Skills */}
          <div className="space-y-2">
            <FormLabel>Your Skills ({skills.length})</FormLabel>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
              {skills.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No skills added yet
                </p>
              ) : (
                skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Skill Suggestions */}
          <div className="space-y-2">
            <FormLabel>Suggested Skills</FormLabel>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions
                .filter((skill) => !skills.includes(skill))
                .slice(0, 12)
                .map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => addSuggestedSkill(skill)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
