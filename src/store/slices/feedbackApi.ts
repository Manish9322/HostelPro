import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Feedback } from '@/lib/types';

export const feedbackApi = createApi({
  reducerPath: 'feedbackApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Feedback'],
  endpoints: (builder) => ({
    getFeedback: builder.query<Feedback[], void>({
      query: () => 'feedback',
      providesTags: ['Feedback'],
    }),
    addFeedback: builder.mutation<Feedback, Partial<Feedback>>({
        query: (body) => ({
            url: 'feedback',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Feedback'],
    }),
    deleteFeedback: builder.mutation<{success: boolean, id: string}, string>({
        query: (id) => ({
            url: `feedback?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Feedback'],
    }),
  }),
});

export const { useGetFeedbackQuery, useAddFeedbackMutation, useDeleteFeedbackMutation } = feedbackApi;
