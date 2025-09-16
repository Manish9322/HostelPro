import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Application } from '@/lib/types';

export const applicationsApi = createApi({
  reducerPath: 'applicationsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Applications'],
  endpoints: (builder) => ({
    getApplications: builder.query<Application[], void>({
      query: () => 'applications',
      providesTags: ['Applications'],
    }),
    addApplication: builder.mutation<Application, FormData>({
      query: (body) => ({
        url: 'applications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Applications'],
    }),
    updateApplicationStatus: builder.mutation<Application, { id: string; status: 'Approved' | 'Rejected' }>({
      query: ({ id, status }) => ({
        url: `applications?id=${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Applications'],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useAddApplicationMutation,
  useUpdateApplicationStatusMutation,
} = applicationsApi;
