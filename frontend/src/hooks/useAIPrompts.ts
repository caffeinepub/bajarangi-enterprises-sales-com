import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AIPromptEntry } from '../backend';
import { toast } from 'sonner';

export function useGetAllAIPromptEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<AIPromptEntry[]>({
    queryKey: ['aiPromptEntries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const entries = await actor.getAllAIPromptEntries();
        return [...entries].sort((a, b) => Number(b.timestamp - a.timestamp));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveAIPromptEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { promptText: string; transformationDescriptor: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveAIPromptEntry(data.promptText, data.transformationDescriptor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aiPromptEntries'] });
    },
    onError: () => {
      toast.error('Could not save prompt history (login required)');
    },
  });
}
