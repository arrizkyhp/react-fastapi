import {Contact} from "@/types/contact.ts";
import {PaginationInfo} from "@/types/responses.ts";

export interface FetchContactsResponse {
    items: Contact[];
    pagination: PaginationInfo;
}

export interface ContactProps {
    onEditClick: (contact: Contact) => void;
    onDeleteClick: (contact: Contact) => void;
}
