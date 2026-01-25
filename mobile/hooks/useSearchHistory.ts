import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";
import { SearchHistory } from "../types";

export const useSearchHistory = () => {
    const api = useApiClient();
    const queryClient = useQueryClient();

    const {
        data: historyData,
        error,
        refetch,
    } = useQuery({
        queryKey: ["searchHistory"],
        queryFn: () => userApi.getSearchHistory(api),
        select: (response) => response.data.searchHistory as SearchHistory[],
    });

    const saveHistoryMutation = useMutation({
        mutationFn: ({ query, searchedUserId }: { query: string; searchedUserId?: string }) =>
            userApi.saveSearchHistory(api, query, searchedUserId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
        },
    });

    const clearHistoryMutation = useMutation({
        mutationFn: (id?: string) => userApi.clearSearchHistory(api, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
        },
    });

    return {
        history: historyData || [],
        error,
        refetch,
        saveHistory: (query: string, searchedUserId?: string) =>
            saveHistoryMutation.mutate({ query, searchedUserId }),
        clearHistory: (id?: string) => clearHistoryMutation.mutate(id),
        isLoading: saveHistoryMutation.isPending || clearHistoryMutation.isPending,
    };
};
