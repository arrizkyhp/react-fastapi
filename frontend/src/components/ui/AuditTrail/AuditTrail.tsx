import { CalendarIcon, Clock, Filter, Plus, Search, SquarePen, Trash2, User, X} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge.tsx";
import {cn} from "@/lib/utils.ts";
import { formatDateTimeUS } from "@/lib/date-utils";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {Separator} from "@/components/ui/separator.tsx";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import useAuditTrail from "./AuditTrail.hooks.tsx";
import {AUDIT_ACTION_TYPES, PAGE_SIZE_OPTIONS} from "./AuditTrail.constants.ts";
import {AuditTrailProps, formatMonthDay} from "./AuditTrail.types";

const AuditTrailComponent = ({
       title,
       entityType,
       searchPlaceholder = "Search by username, description, entity type, and field name...",
       icon: Icon = Clock
}: AuditTrailProps) => {
    const {
        searchQuery,
        onSearchChange,
        setSearchQuery,
        handleSort,
        getSortIcon,
        hasActiveFilters,
        clearFilters,
        actionFilter,
        handleActionFilterChange,
        userFilter,
        handleUserFilterChange,
        handleFromDateChange,
        handleToDateChange,
        dateFrom,
        dateTo,
        pagination,
        onPageSizeChange,
        startIndex,
        endIndex,
        onPageChange,
        items,
        getBadgeColorClass,
        renderChangeDetails,
        userOptions
    } = useAuditTrail({ entityType });

    return (
        <div className="mt-2">
            <div className="flex gap-2 items-center">
                <Icon className="h-5 w-5"/>
                <h2 className="font-semibold text-2xl">{title}</h2>
            </div>
            <div className="flex my-4">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                            onSearchChange(e.target.value)
                            setSearchQuery(e.target.value)
                        }}
                        className="max-w-md"
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sort by:</span>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("timestamp")} className="h-8 px-2">
                        Date {getSortIcon("timestamp")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("user")} className="h-8 px-2">
                        User {getSortIcon("user")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("action")} className="h-8 px-2">
                        Action {getSortIcon("action")}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSort("entity")} className="h-8 px-2">
                        Entity {getSortIcon("entity")}
                    </Button>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {hasActiveFilters && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                >
                                    !
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Filters</h4>
                                {hasActiveFilters && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        <X className="h-4 w-4 mr-1" />
                                        Clear
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm font-medium">Action Type</Label>
                                    <Select
                                        value={actionFilter}
                                        onValueChange={(value) => {
                                            handleActionFilterChange(value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AUDIT_ACTION_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium">User</Label>
                                    <Select
                                        value={userFilter}
                                        onValueChange={(value) => {
                                            handleUserFilterChange(value)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key="all" value="all">
                                                All Users
                                            </SelectItem>
                                            {userOptions.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Label className="text-sm font-medium">From Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dateFrom ? formatMonthDay(dateFrom) : "Select"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateFrom}
                                                    onSelect={(date) => {
                                                        handleFromDateChange(date)
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium">To Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {dateTo ? formatMonthDay(dateTo) : "Select"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={dateTo}
                                                    onSelect={(date) => {
                                                        handleToDateChange(date)
                                                    }}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            {/* Sort Controls */}
            <Separator className="my-4"/>
            <div className="flex gap-2 items-center justify-between">
                <div className="flex gap-2 items-center">
                    <Select
                        onValueChange={(value) => {
                            if (pagination && onPageSizeChange) {
                                onPageSizeChange(Number(value));
                            }
                        }}
                        defaultValue={String(pagination?.per_page) || '10'}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {PAGE_SIZE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-neutral-500">
                        {pagination && pagination.total_items > 0 ? (
                            <>
                                Showing {startIndex} to {endIndex} of{" "}
                                {pagination.total_items} results.
                            </>
                        ) : (
                            <>No results.</>
                        )}
                    </div>
                </div>
                {pagination && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onPageChange(pagination.current_page - 1)
                            }
                            disabled={pagination.current_page <= 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                onPageChange(pagination.current_page + 1)
                            }
                            disabled={
                                pagination.current_page >= pagination.total_pages
                            }
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
            <ScrollArea className="h-[500px] pr-4 mt-4">
                <div className="flex flex-col gap-2">
                    {items?.map((auditTrail) => (
                        <Card key={auditTrail.id} className="rounded-sm shadow-none">
                            <CardContent className="px-4">
                                <div className="flex items-start gap-2">
                                    <div className="flex p-2 items-center rounded-full bg-gray-100">
                                        {auditTrail.action_type === "UPDATE" && (
                                            <SquarePen className="w-4 h-4" />
                                        )}
                                        {auditTrail.action_type === "CREATE" && (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        {auditTrail.action_type === "DELETE" && (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2 text-sm">
                                            <Badge
                                                className={cn(
                                                    "uppercase",
                                                    getBadgeColorClass(auditTrail.action_type),
                                                )}
                                            >
                                                {auditTrail.action_type}
                                            </Badge>
                                            <p className="font-bold">{auditTrail.entity_type}</p>
                                            <p className="text-neutral-500">#{auditTrail.entity_id}</p>
                                        </div>
                                        <div className="text-sm ">
                                            <p>{auditTrail.description}</p>
                                        </div>
                                        <div className="flex gap-2 items-center text-xs text-gray-500">
                                            <User className="w-3 h-3"/>
                                            <p>{auditTrail.user_details.username}</p>
                                            <p>•</p>
                                            <p>{formatDateTimeUS(auditTrail.timestamp)}</p>
                                        </div>
                                        {auditTrail.action_type === "UPDATE" && (
                                            <div className="text-sm p-3 bg-neutral-100 w-full rounded-md mt-2">
                                                <p className="font-semibold mb-1">Changes:</p>
                                                {renderChangeDetails(auditTrail)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default AuditTrailComponent
