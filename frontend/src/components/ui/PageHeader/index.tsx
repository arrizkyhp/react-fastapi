import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

interface PageHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBack?: () => void;
    actions?: React.ReactNode; // For buttons, etc.
}

const PageHeader = (props: PageHeaderProps) => {
    const { title,
        showBackButton = true,
        onBack,
        actions,
    } = props;

    return (
        <div className="flex justify-between items-center gap-2 w-full">
            <div className="flex gap-2 items-start">
                {showBackButton && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <div className="flex flex-col gap-1">
                    <h2 className="font-bold text-xl">{title}</h2>
                </div>
            </div>
            <div className="flex gap-2">{actions}</div>
        </div>
    );
};

export default PageHeader;
