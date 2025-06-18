import {Input} from "@/components/ui/input.tsx";
import {FormEvent} from "react";
import { SheetFooter, SheetHeader} from "@/components/ui/sheet.tsx";
import { Button } from "@/components/ui/button";

interface ContactFormProps {
    handleSubmit: (e: FormEvent) => Promise<void>;
    firstName: string;
    lastName: string;
    email: string;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setEmail: (email: string) => void;
    isEdit: boolean;
}

const ContactForm = (props: ContactFormProps) => {
   const {
       handleSubmit,
       firstName,
       lastName,
       email,
       setFirstName,
       setLastName,
       setEmail,
       isEdit,
   } = props;

    return (
            <div >
                <SheetHeader>
                    <h2>{`${isEdit ? 'Edit' : 'Create'} Contact Form`} </h2>
                </SheetHeader>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col px-4 items-start gap-2">
                        <label htmlFor="firstName">First Name:</label>
                        <Input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <label htmlFor="lastName">Last Name:</label>
                        <Input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <label htmlFor="email">Email:</label>
                        <Input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <SheetFooter>
                        <Button type="submit">
                            {`${isEdit ? 'Edit' : 'Create'} Contact`}
                        </Button>
                    </SheetFooter>
                </form>
            </div>

    )
}

export default ContactForm;
