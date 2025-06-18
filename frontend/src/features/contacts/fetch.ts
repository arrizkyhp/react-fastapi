import {Contact} from "@/types/contact.ts";
import {BaseQueryParams, PaginationInfo} from "@/types/responses.ts";
import api from "@/lib/axios.ts";

interface FetchContactsResponse {
    contacts: Contact[];
    pagination: PaginationInfo;
}

// --- GET Contacts ---
export const fetchContacts = async (params: BaseQueryParams): Promise<FetchContactsResponse> => {
    const response = await api.get<FetchContactsResponse>('/app/contacts', {
        params: {
            page: params.page,
            per_page: params.per_page || '10',
        },
    });
    return response.data;
};

// --- CREATE Contact ---
export const createContact = async (contactData: Omit<Contact, 'id'>): Promise<Contact> => {
    // Axios POST request directly takes data as the second argument
    const response = await api.post<Contact>('/app/contacts', contactData);
    return response.data;
};

// --- UPDATE Contact ---
export const updateContact = async (id: number, contactData: Partial<Omit<Contact, 'id'>>): Promise<Contact> => {
    // Axios PATCH request directly takes data as the second argument
    const response = await api.patch<Contact>(`/app/contacts/${id}`, contactData);
    return response.data;
};

// --- DELETE Contact ---
export const deleteContact = async (id: number): Promise<void> => {
    // Axios DELETE request
    await api.delete<void>(`/app/contacts/${id}`);
    // No response data typically expected for a successful DELETE, so no return
};
