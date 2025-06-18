import {useMemo} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {usePageHeader} from "@/contexts/PageHeaderContext.tsx";

const CategoryList = () => {
    const navigate = useNavigate();

    const handleCreateCategory = () => {
        navigate("/categories/create");
    }

    const userHeaderConfig = useMemo(() => ({
        title: "Category List",
        breadcrumbs: [{ label: "Category List" }],
        showBackButton: false,
        actions: (
            <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleCreateCategory}
            >
                Create Category
            </Button>
        )
    }), []);

    usePageHeader(userHeaderConfig);

    return (
        <div>
            AA
        </div>
    )
}

export default CategoryList;
