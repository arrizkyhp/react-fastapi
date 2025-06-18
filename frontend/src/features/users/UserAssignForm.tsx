import {SheetFooter, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {MultiSelect} from "@/components/ui/MultiSelect";
import {FormEvent, useEffect, useState} from "react";
import useGetData from "@/hooks/useGetData.ts";
import {SelectOption} from "@/types/common.ts";
import {Role} from "@/types/role.ts";
import { Label } from "@/components/ui/label";
import { User } from "@/types/user";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {usePatchData} from "@/hooks/useMutateData.ts";
import {toast} from "sonner";
import {Check} from "lucide-react";

interface UserAssignFormProps {
    userData: User
    setIsSheetOpen: (open: boolean) => void
}

const UserAssignForm = (props: UserAssignFormProps) => {
    const {userData, setIsSheetOpen} = props;

    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [userName, setUsername] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (userData) {
            setUsername(userData.username);
            setEmail(userData.email);
            // Map the roles from userData to the format required by MultiSelect
            setSelectedRoles(userData.roles.map((role) => String(role.id)));
        }
    }, [userData]); // Re-run this effect when userData changes

    const { data: roleOptionsData } = useGetData<
        SelectOption[]
    >(["roleOptions"], "/app/roles/options", {
        normalizer: (data) =>
            data.map((role: Role) => ({
                label: role.name,
                value: String(role.id),
            })),
    });

    const {
        mutate: updateUserMutation,
    } = usePatchData(
        ['assignUserRole', String(userData.id)],
        `/app/users/${userData.id}`,
        {
            options: {
                onSuccess: () => {
                    toast('User updated successfully!', {
                        position: 'top-center',
                        icon: <Check />
                    });
                    setIsSheetOpen(false)
                },
                onError: (err) => toast(`Update failed: ${err.message}`),
            },
        },
        ['userList'], // Invalidate contacts list and potentially individual contact detail
    );

    const optionsRole = roleOptionsData || []

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const data = {
            userName,
            email,
            role_ids: selectedRoles,
        }

        updateUserMutation(data)

    }


    return (
        <>
            <SheetHeader>
                <SheetTitle> Assign User Role </SheetTitle>
            </SheetHeader>

            <div className="p-4">
                <form>
                    <div className="grid gap-2">
                            <div className="flex flex-col items-start gap-2">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    type="text"
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled
                                />
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="text"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled
                                />
                                <Label htmlFor="roleSelect">Roles</Label>
                                <MultiSelect
                                    id="roleSelect"
                                    options={optionsRole}
                                    onValueChange={setSelectedRoles}
                                    placeholder="Select Roles"
                                    value={selectedRoles}
                                    variant="inverted"
                                    maxCount={3}
                                />
                            </div>
                    </div>
                    <SheetFooter className="mt-4">
                        <Button type="submit" onClick={handleSubmit}>
                            Assign User Role
                        </Button>
                    </SheetFooter>
                </form>
            </div>
        </>
    )
}

export default UserAssignForm
