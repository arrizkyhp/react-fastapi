import useQueryParams from "@/hooks/useQueryParams.ts";
import useGetData from "@/hooks/useGetData.ts";
import {FetchContactsResponse} from "@/features/contacts/ContactList/ContactList.types.ts";
import {BaseQueryParams} from "@/types/responses.ts";
import createQueryParams from "@/utils/createQueryParams.ts";
import {FormEvent, useMemo, useState} from "react";
import {useDeleteData, usePatchData, usePostData} from "@/hooks/useMutateData.ts";
import type {Contact} from "@/types/contact.ts";
import {toast} from "sonner";
import {Check} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";
import {ENDPOINTS} from "@/constants/apiUrl.ts";

const useContactList = () => {
    const { queryParams, onPageChange, onPageSizeChange } = useQueryParams()
    const {
        CONTACTS: {
            GET: GET_CONTACTS,
            UPDATE: UPDATE_CONTACT,
            CREATE: CREATE_CONTACT,
            DELETE: DELETE_CONTACT,
        }
    } = ENDPOINTS

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingContactId, setEditingContactId] = useState<number | null>(null);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [contactToDeleteId, setContactToDeleteId] = useState<number | null>(null); // State for contact ID to delete
    const [contactToDeleteName, setContactToDeleteName] = useState<string | null>(null); // New state for contact name to delete

    const { data } = useGetData<FetchContactsResponse, BaseQueryParams>(
        ['listContacts', createQueryParams(queryParams || {})],
        GET_CONTACTS,
        {
            params: {
                page: queryParams.page,
                per_page: queryParams.per_page || 10,
            },
        }
    )

    const {
        mutate: createContactMutation,
    } = usePostData<Contact, Omit<Contact, 'id'>>(
        ['createContact'],
        CREATE_CONTACT,
        {
            options: {
                onSuccess: () => {
                    toast('Contact created successfully!', {
                        position: 'top-center',
                        icon: <Check />,
                    });
                    // This invalidation is handled by `usePostData` due to `queryInvalidateKeys`
                    // queryClient.invalidateQueries({ queryKey: ['contacts'] });

                    // Clear form and close sheet
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setIsSheetOpen(false);
                },
                onError: (err) => {
                    alert(`Error creating contact: ${err.message}`);
                    console.error('Create Contact Error:', err);
                },
            },
        },
        ['listContacts'], // Invalidate the 'contacts' query key on success
    );

    const {
        mutate: updateContactMutation,
    } = usePatchData(
        ['updateContact', String(editingContactId)], // Mutation key
        UPDATE_CONTACT(String(editingContactId)), // URL for this specific contact
        {
            options: {
                onSuccess: () => {
                    toast('Contact updated successfully!', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    setEditingContactId(null);
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setIsSheetOpen(false);
                },
                onError: (err) => toast(`Update failed: ${err.message}`),
            },
        },
        ['listContacts'], // Invalidate contacts list and potentially individual contact detail
    );

    const {
        mutate: deleteContactMutation,
    } = useDeleteData<void, number>(
        ['deleteContact', String(contactToDeleteId)], // Mutation key
        DELETE_CONTACT(String(contactToDeleteId)), // URL for this specific contact
        {
            options: {
                onSuccess: () => {
                    toast('Contact deleted successfully', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    setIsAlertDialogOpen(false);
                    setContactToDeleteId(null);
                    setContactToDeleteName(null);

                },
                onError: (err) => toast(`Delete failed: ${err.message}`),
            },
        },
        ['listContacts'], // Invalidate the contacts list after deletion
    );

    const handleOpenCreateSheet = () => {
        // Clear the form fields when opening for creation
        setEditingContactId(null);
        setFirstName('');
        setLastName('');
        setEmail('');
        setIsSheetOpen(true);
    };

    const handleOpenEditSheet = (contact: Contact) => {
        setEditingContactId(contact.id); // Set the ID of the contact being edited
        setFirstName(contact.firstName);
        setLastName(contact.lastName);
        setEmail(contact.email);
        setIsSheetOpen(true);
    };

    const handleDeleteContact = async (contact: Contact) => {
        setContactToDeleteId(contact.id);
        setContactToDeleteName(`${contact.firstName} ${contact.lastName}`);
        setIsAlertDialogOpen(true);
    }

    const handleDeleteContactConfirm = async () => {
        if (contactToDeleteId !== null) {
            deleteContactMutation(contactToDeleteId);
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            email,
        }

        if (editingContactId) {
            updateContactMutation(data);
        } else {
            createContactMutation(data);
        }
    }

    const userHeaderConfig = useMemo(() => ({
        title: "Contact List",
        breadcrumbs: [{ label: "Contact List" }],
        showBackButton: false,
        actions: (
            <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleOpenCreateSheet}
            >
                Create Contact
            </Button>
        )
    }), []);

    usePageHeader(userHeaderConfig);

    return {
        contactToDeleteName,
        data,
        editingContactId,
        firstName,
        lastName,
        email,
        handleDeleteContactConfirm,
        handleDeleteContact,
        handleSubmit,
        handleOpenCreateSheet,
        handleOpenEditSheet,
        isSheetOpen,
        isAlertDialogOpen,
        setIsAlertDialogOpen,
        setIsSheetOpen,
        setFirstName,
        setLastName,
        setEmail,
        onPageChange,
        onPageSizeChange
    }
}

export default useContactList
