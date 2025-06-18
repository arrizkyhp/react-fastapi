import AuditTrailComponent from "@/components/ui/AuditTrail"
import {Clock} from "lucide-react";

const PermissionAuditTrail = () => {
    return (
        <AuditTrailComponent
            title="Permission Management Audit Trail"
            entityType="Permission"
            searchPlaceholder="Search by username, description, entity type, and field name..."
            icon={Clock}
        />
    )
}

export default PermissionAuditTrail
