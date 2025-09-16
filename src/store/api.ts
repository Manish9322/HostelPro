import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Application, Student, Room, FeePayment, InventoryItem, Complaint, Notice, BoardMember, Faq, GalleryImage, Feedback, Inquiry } from '@/lib/types';

interface SettingsData {
    _id: string;
    roomConditions: string[];
    inventoryCategories: string[];
    inventoryConditions: string[];
    inventoryStatus: string[];
    complaintCategories: string[];
    noticeCategories: string[];
    boardMemberDesignations: string[];
    locationAddress: string;
    locationMapLink: string;
    [key: string]: any; 
}

interface Utility {
    _id: string;
    name: string;
    price: number;
}

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
        getApplications: builder.query<Application[], void>({
          query: () => 'applications',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Applications' as const, id: _id })), { type: 'Applications', id: 'LIST' }] : [{ type: 'Applications', id: 'LIST' }],
        }),
        addApplication: builder.mutation<Application, FormData>({
          query: (body) => ({
            url: 'applications',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Applications', id: 'LIST' }],
        }),
        updateApplicationStatus: builder.mutation<Application, { id: string; status: 'Approved' | 'Rejected' }>({
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
        getStudents: builder.query<Student[], void>({
          query: () => 'students',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Students' as const, id: _id })), { type: 'Students', id: 'LIST' }] : [{ type: 'Students', id: 'LIST' }],
        }),
        addStudent: builder.mutation<Student, Partial<Student>>({
          query: (body) => ({
            url: 'students',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Students', id: 'LIST' }],
        }),
        updateStudent: builder.mutation<Student, { id: string; body: Partial<Student> }>({
          query: ({ id, body }) => ({
            url: `students?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Students', id }],
        }),
        deleteStudent: builder.mutation<{ success: boolean; id: string }, string>({
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
        getRooms: builder.query<Room[], void>({
          query: () => 'rooms',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Rooms' as const, id: _id })), { type: 'Rooms', id: 'LIST' }] : [{ type: 'Rooms', id: 'LIST' }],
        }),
        addRoom: builder.mutation<Room, Partial<Room>>({
          query: (body) => ({
            url: 'rooms',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Rooms', id: 'LIST' }],
        }),
        updateRoom: builder.mutation<Room, { id: string; body: Partial<Room> }>({
          query: ({ id, body }) => ({
            url: `rooms?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Rooms', id }],
        }),
        deleteRoom: builder.mutation<{ success: boolean; id: string }, string>({
          query: (id) => ({
            url: `rooms?id=${id}`,
            method: 'DELETE',
          }),
          invalidatesTags: [{ type: 'Rooms', id: 'LIST' }],
        }),
        allocateRooms: builder.mutation<{allocatedCount: number, waitingListCount: number}, {priority: string, matchGender: boolean, matchPreferences: boolean}>({
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
        getFeePayments: builder.query<FeePayment[], string | void>({
          query: (studentId) => (studentId ? `fees?studentId=${studentId}` : 'fees'),
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Fees' as const, id: _id })), { type: 'Fees', id: 'LIST' }] : [{ type: 'Fees', id: 'LIST' }],
        }),
        addFeePayment: builder.mutation<FeePayment, Partial<FeePayment>>({
          query: (body) => ({
            url: 'fees',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Fees', id: 'LIST' }],
        }),
        updateFeePayment: builder.mutation<FeePayment, { id: string; body: Partial<FeePayment> }>({
          query: ({ id, body }) => ({
            url: `fees?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Fees', id }],
        }),
        deleteFeePayment: builder.mutation<{ success: boolean; id: string }, string>({
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
        getInventory: builder.query<InventoryItem[], void>({
          query: () => 'inventory',
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Inventory' as const, id: _id })), { type: 'Inventory', id: 'LIST' }] : [{ type: 'Inventory', id: 'LIST' }],
        }),
        addInventoryItem: builder.mutation<InventoryItem, Partial<InventoryItem>>({
          query: (body) => ({
            url: 'inventory',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Inventory', id: 'LIST' }],
        }),
        updateInventoryItem: builder.mutation<InventoryItem, { id: string; body: Partial<InventoryItem> }>({
          query: ({ id, body }) => ({
            url: `inventory?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Inventory', id }],
        }),
        deleteInventoryItem: builder.mutation<{ success: boolean; id: string }, string>({
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
        getComplaints: builder.query<Complaint[], string | void>({
          query: (studentId) => (studentId ? `complaints?studentId=${studentId}` : 'complaints'),
          providesTags: (result) => result ? [...result.map(({ _id }) => ({ type: 'Complaints' as const, id: _id })), { type: 'Complaints', id: 'LIST' }] : [{ type: 'Complaints', id: 'LIST' }],
        }),
        addComplaint: builder.mutation<Complaint, Partial<Complaint>>({
          query: (body) => ({
            url: 'complaints',
            method: 'POST',
            body,
          }),
          invalidatesTags: [{ type: 'Complaints', id: 'LIST' }],
        }),
        updateComplaintStatus: builder.mutation<Complaint, { id: string; status: 'In Progress' | 'Resolved' }>({
          query: ({ id, status }) => ({
            url: `complaints?id=${id}`,
            method: 'PUT',
            body: { status },
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Complaints', id }],
        }),
        deleteComplaint: builder.mutation<{ success: boolean; id: string }, string>({
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
        getNotices: builder.query<Notice[], void>({
          query: () => 'notices',
          providesTags: ['Notices'],
        }),
        addNotice: builder.mutation<Notice, Omit<Notice, '_id' | 'id' | 'publishedAt'>>({
            query: (body) => ({
                url: 'notices',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Notices'],
        }),
        updateNotice: builder.mutation<Notice, {id: string, body: Partial<Notice>}>({
            query: ({id, body}) => ({
                url: `notices?id=${id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Notices'],
        }),
        deleteNotice: builder.mutation<{success: boolean, id: string}, string>({
            query: (id) => ({
                url: `notices?id=${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Notices'],
        }),
        reorderNotices: builder.mutation<void, { orderedIds: string[] }>({
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
        getBoardMembers: builder.query<BoardMember[], { visibleOnly?: boolean }>({
          query: ({ visibleOnly = false }) => `board-members?visible=${visibleOnly}`,
          providesTags: ['BoardMembers'],
        }),
        addBoardMember: builder.mutation<BoardMember, FormData>({
          query: (body) => ({
            url: 'board-members',
            method: 'POST',
            body,
          }),
          invalidatesTags: ['BoardMembers'],
        }),
        updateBoardMember: builder.mutation<BoardMember, { id: string; body: FormData | Partial<BoardMember> }>({
          query: ({ id, body }) => ({
            url: `board-members?id=${id}`,
            method: 'PUT',
            body,
          }),
          invalidatesTags: ['BoardMembers'],
        }),
        deleteBoardMember: builder.mutation<{ success: boolean; id: string }, string>({
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
        getSettings: builder.query<SettingsData, void>({
          query: () => 'settings',
          providesTags: ['Settings'],
        }),
        updateSettings: builder.mutation<SettingsData, Partial<SettingsData>>({
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


export const galleryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getGalleryImages: builder.query<GalleryImage[], void>({
          query: () => 'gallery',
          providesTags: ['Gallery'],
        }),
        addGalleryImage: builder.mutation<GalleryImage, FormData>({
            query: (body) => ({
                url: 'gallery',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Gallery'],
        }),
        deleteGalleryImage: builder.mutation<{success: boolean, id: string}, string>({
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


export const utilitiesApi = api.injectEndpoints({
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


export const inquiriesApi = api.injectEndpoints({
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
