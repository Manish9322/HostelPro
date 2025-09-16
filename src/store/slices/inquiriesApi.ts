import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Inquiry } from '@/lib/types';

export const inquiriesApi = createApi({
  reducerPath: 'inquiriesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Inquiries'],
  endpoints: (builder) => ({
    getInquiries: builder.query<Inquiry[], void>({
      query: () => 'inquiries',
      providesTags: ['Inquiries'],
    }),
    addInquiry: builder.mutation<Inquiry, Partial<Inquiry>>({
        query: (body) => ({
            url: 'inquiry',
            method: 'POST',
            body
        }),
        invalidatesTags: ['Inquiries'],
    }),
    updateInquiry: builder.mutation<Inquiry, { id: string; body: Partial<Inquiry> }>({
      query: ({ id, body }) => ({
        url: `inquiries?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Inquiries'],
    }),
  }),
});

export const { useGetInquiriesQuery, useAddInquiryMutation, useUpdateInquiryMutation } = inquiriesApi;
