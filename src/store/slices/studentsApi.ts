import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Student } from '@/lib/types';

export const studentsApi = createApi({
  reducerPath: 'studentsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Students'],
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => 'students',
      providesTags: ['Students'],
    }),
    addStudent: builder.mutation<Student, Partial<Student>>({
      query: (body) => ({
        url: 'students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Students'],
    }),
    updateStudent: builder.mutation<Student, { id: string; body: Partial<Student> }>({
      query: ({ id, body }) => ({
        url: `students?id=${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Students'],
    }),
    deleteStudent: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `students?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Students'],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;
