import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Complaint } from '@/lib/types';

export const complaintsApi = createApi({
  reducerPath: 'complaintsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Complaints'],
  endpoints: (builder) => ({
    getComplaints: builder.query<Complaint[], string | void>({
      query: (studentId) => (studentId ? `complaints?studentId=${studentId}` : 'complaints'),
      providesTags: ['Complaints'],
    }),
    addComplaint: builder.mutation<Complaint, Partial<Complaint>>({
      query: (body) => ({
        url: 'complaints',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Complaints'],
    }),
    updateComplaintStatus: builder.mutation<Complaint, { id: string; status: 'In Progress' | 'Resolved' }>({
      query: ({ id, status }) => ({
        url: `complaints?id=${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Complaints'],
    }),
    deleteComplaint: builder.mutation<{ success: boolean; id: string }, string>({
        query: (id) => ({
            url: `complaints?id=${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Complaints'],
    })
  }),
});

export const {
  useGetComplaintsQuery,
  useAddComplaintMutation,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} = complaintsApi;
