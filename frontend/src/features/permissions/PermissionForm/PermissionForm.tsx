import { Label } from "@/components/ui/label";
import {SheetFooter, SheetHeader} from "@/components/ui/sheet";
import {SquarePen, PlusCircle, Check, Loader2} from "lucide-react"; // Added PlusCircle for create mode icon
import { Permission } from "@/types/permission";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react"; // Added useEffect
import useGetAllCategories from "@/hooks/useGetAllCategories";
import { SelectOption } from "@/types/common";
import formatOptions from "@/utils/formatOptions";
import { Category } from "@/types/category";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Switch } from "@/components/ui/switch"; // Import Switch
import { Button } from "@/components/ui/button";
import {usePatchData, usePostData } from "@/hooks/useMutateData";
import {ENDPOINTS} from "@/constants/apiUrl.ts";
import {toast} from "sonner";

// Define the mode type
type FormMode = "create" | "edit";

interface PermissionFormProps {
    data?: Permission; // Make data optional for create mode
    mode: FormMode; // Add mode prop
    onSuccess?: () => void;
}

const PermissionForm = (props: PermissionFormProps) => {
    const { data, mode, onSuccess } = props;
    const { PERMISSIONS: { CREATE, UPDATE } } = ENDPOINTS

    const [permissionName, setPermissionName] = useState("");
    const [permissionDescription, setPermissionDescription] = useState("");
    const [permissionStatus, setPermissionStatus] = useState(true); // true for 'active', false for 'inactive'
    const [permissionCategoryId, setPermissionCategoryId] = useState<
        string | undefined
    >(undefined);

    const { categoriesData } = useGetAllCategories();

    useEffect(() => {
        if (mode === "edit" && data) {
            setPermissionName(data.name || "");
            setPermissionDescription(data.description || "");
            setPermissionStatus(data.status === "active");
            setPermissionCategoryId(data.category_id?.toString() || undefined);
        } else if (mode === "create") {
            // Reset fields for create mode if component is reused
            setPermissionName("");
            setPermissionDescription("");
            setPermissionStatus(true); // Default to active for new permissions
            setPermissionCategoryId(undefined);
        }
    }, [mode, data]);

    // Format categories into select options
    const categoryOptions: SelectOption[] = useMemo(
        () => formatOptions<Category>(categoriesData?.items, "id", "name"),
        [categoriesData],
    );

    const handleCategorySelectChange = (value: string) => {
        setPermissionCategoryId(value);
    };

    const handleStatusChange = (checked: boolean) => {
        setPermissionStatus(checked);
    };

    // Function to gather current form values (for potential onSubmit)
// Mutation for creating a permission
    const { mutate: createPermissionMutation, isLoading: isCreating } = usePostData(
        ["createPermission"], // Mutation key
        CREATE, // Endpoint for POST
        {
            options: {
                onSuccess: () => {
                    toast("Permission created successfully!", {
                        position: "top-center",
                        icon: <Check />,
                    });
                    onSuccess?.();
                },
                onError: (err: any) => {
                    const errorMessage =
                        err?.response?.data?.message || err?.message || "Unknown error";
                    toast(`Creation failed: ${errorMessage}`, {
                        position: "top-center",
                        icon: <Check className="text-red-500" />,
                    });
                },
            },
        },
        ["permissionList"]
    );

    // Mutation for updating a permission
    const { mutate: updatePermissionMutation, isLoading: isUpdating } = usePatchData(
        ["updatePermission", String(data?.id)], // Mutation key including ID for specific permission
        UPDATE(String(data?.id)), // Endpoint for PATCH (e.g., /permissions/:id)
        {
            options: {
                onSuccess: () => {
                    toast("Permission updated successfully!", {
                        position: "top-center",
                        icon: <Check />,
                    });
                    onSuccess?.();
                },
                onError: (err: any) => {
                    const errorMessage =
                        err?.response?.data?.message || err?.message || "Unknown error";
                    toast(`Update failed: ${errorMessage}`, {
                        position: "top-center",
                        icon: <Check className="text-red-500" />,
                    });
                },
            },
        },
        ["permissionList"]
    );


    const handleSubmit = () => {
        const payload = {
            name: permissionName,
            description: permissionDescription,
            status: permissionStatus ? "active" : "inactive",
            category_id: permissionCategoryId ? parseInt(permissionCategoryId) : undefined,
        };

        if (mode === "create") {
            createPermissionMutation(payload);
        } else if (mode === "edit" && data?.id) {
            updatePermissionMutation(payload);
        }
    };

    const isSubmitting = isCreating || isUpdating;

    return (
        <div>
            <SheetHeader>
                <div className="flex gap-2 items-center">
                    {mode === "edit" ? (
                        <SquarePen className="h-5 w-5" />
                    ) : (
                        <PlusCircle className="h-5 w-5" />
                    )}{" "}
                    {mode === "edit" ? "Permission Edit" : "Create New Permission"}
                </div>
            </SheetHeader>
            <div className="flex flex-col px-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="permissionName">Permission Name</Label>
                        <Input
                            id="permissionName"
                            value={permissionName}
                            placeholder="Enter Permission Name"
                            onChange={(e) => setPermissionName(e.target.value)}
                            disabled={mode === "edit"}
                            readOnly={mode === "edit" && !data?.name} // Allow editing in edit mode unless no name exists
                        />
                        {mode === "edit" && !permissionName && (
                            <p className="text-sm text-muted-foreground">
                                Original: {data?.name || "N/A"}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="categorySelect">Category</Label>
                        <Select
                            value={permissionCategoryId}
                            onValueChange={handleCategorySelectChange}
                        >
                            <SelectTrigger className="w-full" id="categorySelect">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>

                                {categoryOptions.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="permissionStatus">Status</Label>
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="permissionStatus"
                                checked={permissionStatus}
                                onCheckedChange={handleStatusChange}
                            />
                            <Label htmlFor="permissionStatus" className="capitalize">
                                {permissionStatus ? "Active" : "Inactive"}
                            </Label>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="permissionDescription">Description</Label>
                        <Textarea
                            id="permissionDescription"
                            value={permissionDescription}
                            onChange={(e) => setPermissionDescription(e.target.value)}
                            placeholder="Enter permission description"
                            className="min-h-[80px]"
                        />
                        {mode === "edit" && !permissionDescription && (
                            <p className="text-sm text-muted-foreground">
                                Original: {data?.description || "N/A"}
                            </p>
                        )}
                    </div>
                </div>

            </div>
            <SheetFooter>
                {/* You'd typically add a submit button here */}
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mode === "edit" ? "Save Changes" : "Create Permission"}
                </Button>
            </SheetFooter>
        </div>
    );
};

export default PermissionForm;
