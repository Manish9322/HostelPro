import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FeePayment } from '@/lib/types';

export const feesApi = createApi({
  reducerPath: 'feesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Fees'],
  endpoints: (builder) => ({
    getFeePayments: builder.query<FeePayment[], string | void>({
      query: (studentId) => (studentId ? `fees?studentId=${studentId}` : 'fees'),
      providesTags: ['Fees'],
    }),
    addFeePayment: builder.mutation<FeePayment, Partial<FeePayment>>({
      query: (body) => ({
        url: 'fees',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Fees'],
    }),
    updateFeePayment: builder.mutation<FeePayment, { id: string; body: Partial<FeePayment> }>({
      query: ({ id, body }) => ({
        url: `fees?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Fees'],
    }),
    deleteFeePayment: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `fees?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Fees'],
    }),
  }),
});

export const {
  useGetFeePaymentsQuery,
  useAddFeePaymentMutation,
  useUpdateFeePaymentMutation,
  useDeleteFeePaymentMutation,
} = feesApi;
