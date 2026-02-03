/**
 * useNewsletterMutation Hook
 * TanStack Query mutation hook for newsletter subscription
 *
 * Handles newsletter subscription with proper error handling
 */
import { useMutation } from '@tanstack/react-query';
import { subscribeToNewsletter } from '@/services/analytics';
import { logger } from '@/lib/logger';

interface UseNewsletterMutationReturn {
  /**
   * Subscribe to newsletter
   */
  subscribe: (email: string) => Promise<void>;
  /**
   * Whether the mutation is in progress
   */
  isPending: boolean;
  /**
   * Error object if the mutation failed
   */
  error: Error | null;
}

/**
 * TanStack Query mutation hook for newsletter subscription
 *
 * Validates email format before submitting
 *
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { subscribe, isPending, error } = useNewsletterMutation();
 *
 * const handleSubscribe = async () => {
 *   try {
 *     await subscribe(email);
 *     toast.success('Successfully subscribed!');
 *   } catch (error) {
 *     toast.error('Failed to subscribe');
 *   }
 * };
 * ```
 */
export function useNewsletterMutation(): UseNewsletterMutationReturn {
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      // Validate email format
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      return await subscribeToNewsletter(email);
    },
    onSuccess: () => {
      logger.info('Newsletter subscription successful');
    },
    onError: (err) => {
      logger.error('Newsletter subscription error:', err);
    },
  });

  return {
    subscribe: async (email: string) => {
      await mutation.mutateAsync(email);
    },
    isPending: mutation.isPending,
    error: mutation.error as Error | null,
  };
}
