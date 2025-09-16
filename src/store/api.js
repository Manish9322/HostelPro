import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a single API slice object
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [
    'Applications', 
    'Students', 
    'Rooms', 
    'Fees', 
    'Inventory', 
    'Complaints', 
    'Notices', 
    'BoardMembers',
    'Settings',
    'Faqs',
    'Gallery',
    'Feedback',
    'Utilities',
    'Inquiries',
  ],
  endpoints: () => ({}),
});

export const applicationsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getApplications: builder.query({
          query: () => 'applications',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Applications', id: _id })), { type: 'Applications', id: 'LIST' }] : [{ type: 'Applications', id: 'LIST' }],
        }),
        addApplication: builder.mutation({
          query: (body) => ({
            url: 'applications',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
        }),
        updateApplicationStatus: builder.mutation({
          query: ({ id, status }) => ({
            url: `applications?id=${id}`,
            method: 'PUT',
            body: { status },
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Applications', id }],
        }),
      }),
});

export const {
  useGetApplicationsQuery,
  useAddApplicationMutation,
  useUpdateApplicationStatusMutation,
} = applicationsApi;

export const studentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getStudents: builder.query({
          query: () => 'students',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Students', id: _id })), { type: 'Students', id: 'LIST' }] : [{ type: 'Students', id: 'LIST' }],
        }),
        addStudent: builder.mutation({
          query: (body) => ({
            url: 'students',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Students', id: 'LIST' }],
        }),
        updateStudent: builder.mutation({
          query: ({ id, body }) => ({
            url: `students?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Students', id }],
        }),
        deleteStudent: builder.mutation({
          query: (id) => ({
            url: `students?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: (result, error, id) => [{ type: 'Students', id }, { type: 'Students', id: 'LIST' }],
        }),
      }),
});

export const {
  useGetStudentsQuery,
  useAddStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentsApi;

export const roomsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRooms: builder.query({
          query: () => 'rooms',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Rooms', id: _id })), { type: 'Rooms', id: 'LIST' }] : [{ type: 'Rooms', id: 'LIST' }],
        }),
        addRoom: builder.mutation({
          query: (body) => ({
            url: 'rooms',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Rooms', id: 'LIST' }],
        }),
        updateRoom: builder.mutation({
          query: ({ id, body }) => ({
            url: `rooms?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Rooms', id }],
        }),
        deleteRoom: builder.mutation({
          query: (id) => ({
            url: `rooms?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: [{ type: 'Rooms', id: 'LIST' }],
        }),
        allocateRooms: builder.mutation({
            query: (body) => ({
                url: 'rooms/allocate',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Rooms', id: 'LIST' }, { type: 'Students', id: 'LIST' }],
        })
      }),
});

export const {
  useGetRoomsQuery,
  useAddRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useAllocateRoomsMutation,
} = roomsApi;


export const feesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFeePayments: builder.query({
          query: (studentId) => (studentId ? `fees?studentId=${studentId}` : 'fees'),
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Fees', id: _id })), { type: 'Fees', id: 'LIST' }] : [{ type: 'Fees', id: 'LIST' }],
        }),
        addFeePayment: builder.mutation({
          query: (body) => ({
            url: 'fees',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Fees', id: 'LIST' }],
        }),
        updateFeePayment: builder.mutation({
          query: ({ id, body }) => ({
            url: `fees?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Fees', id }],
        }),
        deleteFeePayment: builder.mutation({
          query: (id) => ({
            url: `fees?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: [{ type: 'Fees', id: 'LIST' }],
        }),
      }),
});

export const {
  useGetFeePaymentsQuery,
  useAddFeePaymentMutation,
  useUpdateFeePaymentMutation,
  useDeleteFeePaymentMutation,
} = feesApi;

export const inventoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getInventory: builder.query({
          query: () => 'inventory',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Inventory', id: _id })), { type: 'Inventory', id: 'LIST' }] : [{ type: 'Inventory', id: 'LIST' }],
        }),
        addInventoryItem: builder.mutation({
          query: (body) => ({
            url: 'inventory',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Inventory', id: 'LIST' }],
        }),
        updateInventoryItem: builder.mutation({
          query: ({ id, body }) => ({
            url: `inventory?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }],
        }),
        deleteInventoryItem: builder.mutation({
          query: (id) => ({
            url: `inventory?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: [{ type: 'Inventory', id: 'LIST' }],
        }),
      }),
});

export const {
  useGetInventoryQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
} = inventoryApi;


export const complaintsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getComplaints: builder.query({
          query: (studentId) => (studentId ? `complaints?studentId=${studentId}` : 'complaints'),
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Complaints', id: _id })), { type: 'Complaints', id: 'LIST' }] : [{ type: 'Complaints', id: 'LIST' }],
        }),
        addComplaint: builder.mutation({
          query: (body) => ({
            url: 'complaints',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Complaints', id: 'LIST' }],
        }),
        updateComplaintStatus: builder.mutation({
          query: ({ id, status }) => ({
            url: `complaints?id=${id}`,
            method: 'PUT',
            body: { status },
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Complaints', id }],
        }),
        deleteComplaint: builder.mutation({
            query: (id) => ({
                url: `complaints?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Complaints', id: 'LIST' }],
        })
      }),
});

export const {
  useGetComplaintsQuery,
  useAddComplaintMutation,
  useUpdateComplaintStatusMutation,
  useDeleteComplaintMutation,
} = complaintsApi;

export const noticesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getNotices: builder.query({
          query: () => 'notices',
          providesTags: ['Notices'],
        }),
        addNotice: builder.mutation({
            query: (body) => ({
                url: 'notices',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Notices'],
        }),
        updateNotice: builder.mutation({
            query: ({id, body}) => ({
                url: `notices?id=${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Notices'],
        }),
        deleteNotice: builder.mutation({
            query: (id) => ({
                url: `notices?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notices'],
        }),
        reorderNotices: builder.mutation({
            query: (body) => ({
                url: 'notices/reorder',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Notices'],
        })
      }),
});

export const { 
    useGetNoticesQuery,
    useAddNoticeMutation,
    useUpdateNoticeMutation,
    useDeleteNoticeMutation,
    useReorderNoticesMutation,
} = noticesApi;


export const boardMembersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getBoardMembers: builder.query({
          query: ({ visibleOnly = false }) => `board-members?visible=${visibleOnly}`,
          providesTags: ['BoardMembers'],
        }),
        addBoardMember: builder.mutation({
          query: (body) => ({
            url: 'board-members',
            method: 'POST',
            body,
          }),
          invalidatesTags: ['BoardMembers'],
        }),
        updateBoardMember: builder.mutation({
          query: ({ id, body }) => ({
            url: `board-members?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: ['BoardMembers'],
        }),
        deleteBoardMember: builder.mutation({
          query: (id) => ({
            url: `board-members?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: ['BoardMembers'],
        }),
      }),
});

export const {
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useUpdateBoardMemberMutation,
  useDeleteBoardMemberMutation,
} = boardMembersApi;


export const settingsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getSettings: builder.query({
          query: () => 'settings',
          providesTags: ['Settings'],
        }),
        updateSettings: builder.mutation({
          query: (body) => ({
            url: 'settings',
            method: 'POST',
            body,
          }),
          invalidatesTags: ['Settings'],
        }),
      }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;


export const faqsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query({
          query: () => 'faqs',
          providesTags: (result) => 
            result 
              ? [...result.map(({ _id }) => ({ type: 'Faqs', id: _id })), { type: 'Faqs', id: 'LIST' }]
              : [{ type: 'Faqs', id: 'LIST' }],
        }),
        addFaq: builder.mutation({
          query: (body) => ({
            url: 'faqs',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
        }),
        updateFaq: builder.mutation({
          query: ({ id, body }) => ({
            url: `faqs?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Faqs', id }],
        }),
        deleteFaq: builder.mutation({
          query: (id) => ({
            url: `faqs?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: [{ type: 'Faqs', id: 'LIST' }],
        }),
        reorderFaqs: builder.mutation({
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


export const galleryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getGalleryImages: builder.query({
          query: () => 'gallery',
          providesTags: ['Gallery'],
        }),
        addGalleryImage: builder.mutation({
            query: (body) => ({
                url: 'gallery',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Gallery'],
        }),
        deleteGalleryImage: builder.mutation({
            query: (id) => ({
                url: `gallery?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Gallery'],
        })
      }),
});

export const { useGetGalleryImagesQuery, useAddGalleryImageMutation, useDeleteGalleryImageMutation } = galleryApi;


export const feedbackApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getFeedback: builder.query({
          query: () => 'feedback',
          providesTags: ['Feedback'],
        }),
        addFeedback: builder.mutation({
            query: (body) => ({
                url: 'feedback',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Feedback'],
        }),
        deleteFeedback: builder.mutation({
            query: (id) => ({
                url: `feedback?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Feedback'],
        }),
      }),
});

export const { useGetFeedbackQuery, useAddFeedbackMutation, useDeleteFeedbackMutation } = feedbackApi;


export const utilitiesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUtilities: builder.query({
          query: () => 'utilities',
          providesTags: (result) => 
            result 
              ? [...result.map(({ _id }) => ({ type: 'Utilities', id: _id })), { type: 'Utilities', id: 'LIST' }]
              : [{ type: 'Utilities', id: 'LIST' }],
        }),
        addUtility: builder.mutation({
          query: (body) => ({
            url: 'utilities',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Utilities', id: 'LIST' }],
        }),
        updateUtility: builder.mutation({
          query: ({ id, body }) => ({
            url: `utilities?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Utilities', id }],
        }),
        deleteUtility: builder.mutation({
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


export const inquiriesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getInquiries: builder.query({
          query: () => 'inquiries',
          providesTags: ['Inquiries'],
        }),
        addInquiry: builder.mutation({
            query: (body) => ({
                url: 'inquiry',
                method: 'POST',
                body
            }),
            invalidatesTags: ['Inquiries'],
        }),
        updateInquiry: builder.mutation({
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

    