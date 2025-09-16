import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Faq } from '@/lib/types';

export const faqsApi = createApi({
  reducerPath: 'faqsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Faqs'],
  endpoints: (builder) => ({
    getFaqs: builder.query<Faq[], void>({
      query: () => 'faqs',
      providesTags: (result) => 
        result 
          ? [...result.map(({ _id }) => ({ type: 'Faqs' as const, id: _id })), { type: 'Faqs', id: 'LIST' }]
          : [{ type: 'Faqs', id: 'LIST' }],
    }),
    addFaq: builder.mutation<Faq, Omit<Faq, '_id' | 'order'>>({
      query: (body) => ({
        url: 'faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),
    updateFaq: builder.mutation<Faq, { id: string; body: Partial<Faq> }>({
      query: ({ id, body }) => ({
        url: `faqs?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Faqs', id }],
    }),
    deleteFaq: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `faqs?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    }),
    reorderFaqs: builder.mutation<void, { orderedIds: string[] }>({
        query: (body) => ({
            url: 'faqs/reorder',
            method: 'POST',
            body,
        }),
        invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
    })
  }),
});

export const { 
    useGetFaqsQuery,
    useAddFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
    useReorderFaqsMutation,
} = faqsApi;
