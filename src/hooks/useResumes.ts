import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchResumes,
  fetchResumeById,
  createResume,
  updateResume,
} from '@/lib/api/resume.client';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: fetchResumes,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useResume(id: string) {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => fetchResumeById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
}

export function useUpdateResume(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => updateResume(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
    },
  });
}
