import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Utility {
    _id: string;
    name: string;
    price: number;
}

export const utilitiesApi = createApi({
  reducerPath: 'utilitiesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Utilities'],
  endpoints: (builder) => ({
    getUtilities: builder.query<Utility[], void>({
      query: () => 'utilities',
      providesTags: (result) => 
        result 
          ? [...result.map(({ _id }) => ({ type: 'Utilities' as const, id: _id })), { type: 'Utilities', id: 'LIST' }]
          : [{ type: 'Utilities', id: 'LIST' }],
    }),
    addUtility: builder.mutation<Utility, Partial<Utility>>({
      query: (body) => ({
        url: 'utilities',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Utilities', id: 'LIST' }],
    }),
    updateUtility: builder.mutation<Utility, { id: string; body: Partial<Utility> }>({
      query: ({ id, body }) => ({
        url: `utilities?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Utilities', id }],
    }),
    deleteUtility: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `utilities?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Utilities', id: 'LIST' }],
    }),
  }),
});

export const { 
    useGetUtilitiesQuery,
    useAddUtilityMutation,
    useUpdateUtilityMutation,
    useDeleteUtilityMutation,
} = utilitiesApi;
