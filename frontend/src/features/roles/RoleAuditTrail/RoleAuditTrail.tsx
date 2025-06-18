import AuditTrailComponent from "@/components/ui/AuditTrail"
import {Clock} from "lucide-react";

const RoleAuditTrail = () => {

    return (
        <AuditTrailComponent
            title="Role Management Audit Trail"
            entityType="Role"
            searchPlaceholder="Search by username, description, entity type, and field name..."
            icon={Clock}
        />
    )
}

export default RoleAuditTrail
