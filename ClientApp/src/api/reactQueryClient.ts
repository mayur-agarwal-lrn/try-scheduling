import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// This file configures the React Query client with default options for handling queries and mutations.
// It includes retry logic for failed requests and custom retry delays.

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests up to 3 times for certain status codes
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error)) {
          console.log(
            `Retrying queries request, attempt ${failureCount + 1}`,
            error
          );

          const status = error.response?.status ?? 0;
          // Retry for 401, 500, and any other retry-able statuses, up to 3 times
          return failureCount < 3 && (status === 401 || status >= 500);
        } else {
          console.log(
            `Not Retrying queries request, attempt ${failureCount + 1}`,
            error
          );

          return false;
        }
      },
      // Delay between retries: 10s, 20s, 30s (within 60 seconds all retries will be done)
      retryDelay: (attempt) => Math.min(attempt * 10000, 30000),
      // Prevent refetch when switching back to the tab
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Retry failed requests up to 3 times for certain status codes
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error)) {
          console.log(
            `Retrying mutations request, attempt ${failureCount + 1}`,
            error
          );

          const status = error.response?.status ?? 0;
          // Retry for 401, 500, and any other retry-able statuses, up to 3 times
          return failureCount < 3 && (status === 401 || status >= 500);
        } else {
          console.log(
            `Not Retrying mutations request, attempt ${failureCount + 1}`,
            error
          );

          return false;
        }
      },
      // Delay between retries: 10s, 20s, 30s (within 60 seconds all retries will be done)
      retryDelay: (attempt) => Math.min(attempt * 10000, 30000),
    },
  },
});
