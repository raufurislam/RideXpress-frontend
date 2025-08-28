import clsx from "clsx";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/auth/auth.api";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type IUser, Role, IsActive } from "@/types";
import { roleMapper, statusMapper } from "@/utils/mappers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AllUser() {
  const [filters, setFilters] = useState<{
    search: string;
    role: string | "all";
    isActive: string | "all";
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>({ search: "", role: "all", isActive: "all", page: 1, limit: 10 });

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page: filters.page,
      limit: filters.limit,
    };
    // Backend QueryBuilder often uses `searchTerm`
    if (filters.search) params.searchTerm = filters.search;
    if (filters.role !== "all") params.role = filters.role;
    if (filters.isActive !== "all") params.isActive = filters.isActive;
    // Remove sorting from API call - use only client-side sorting for immediate response
    // if (filters.sortBy) params.sortBy = filters.sortBy;
    // if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    return params;
  }, [
    filters.page,
    filters.limit,
    filters.search,
    filters.role,
    filters.isActive,
  ]);

  const { data, isLoading, isFetching, refetch, isError } =
    useGetAllUsersQuery(queryParams);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const { data: meResponse } = useUserInfoQuery();

  const users: IUser[] = (data?.data as IUser[]) ?? [];
  const meta = (data?.meta as {
    page: number;
    limit: number;
    total: number;
  }) ?? {
    page: filters.page,
    limit: filters.limit,
    total: users.length,
  };

  // console.log(users);

  const totalItems = meta.total ?? users.length;
  const pageFromMeta = meta.page ?? filters.page;
  const limitFromMeta = meta.limit ?? filters.limit;
  const totalPages = Math.max(1, Math.ceil(totalItems / limitFromMeta));

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "all",
      isActive: "all",
      page: 1,
      limit: filters.limit,
    });
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((f) => ({
      ...f,
      page: Math.min(Math.max(1, nextPage), totalPages),
    }));
  };

  const handleSort = (key: string) => {
    console.log(
      "Sorting by:",
      key,
      "Current sortBy:",
      filters.sortBy,
      "Current sortOrder:",
      filters.sortOrder
    );
    setFilters((f) => {
      const newSortOrder =
        f.sortBy === key && f.sortOrder === "asc" ? "desc" : "asc";
      console.log("New sortOrder will be:", newSortOrder);
      return {
        ...f,
        sortBy: key,
        sortOrder: newSortOrder,
      };
    });
  };

  // Client-side filtering to ensure robust UX regardless of backend filtering
  const filteredUsers = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        term === "" ||
        (u.name ?? "").toLowerCase().includes(term) ||
        (u.email ?? "").toLowerCase().includes(term) ||
        (u.phone ?? "").toLowerCase().includes(term);
      const matchesRole = filters.role === "all" || u.role === filters.role;
      const matchesStatus =
        filters.isActive === "all" || u.isActive === filters.isActive;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, filters.search, filters.role, filters.isActive]);

  // Client-side sorting (mirrors AllDriver behavior; server-side also supported via params)
  const sortedUsers = useMemo(() => {
    console.log('sortedUsers recalculating:', {
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      filteredUsersLength: filteredUsers.length,
      hasSortBy: !!filters.sortBy
    });
    
    if (!filters.sortBy) return filteredUsers;
    
    const sortKey = filters.sortBy as keyof IUser;
    const direction = filters.sortOrder === "asc" ? 1 : -1;
    
    // Create a copy to avoid mutating the original array
    const copy = [...filteredUsers];
    
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1 * direction;
      if (bVal == null) return -1 * direction;
      
      // Handle date sorting
      if (sortKey === "createdAt") {
        const aNum = new Date(aVal as string).getTime();
        const bNum = new Date(bVal as string).getTime();
        if (aNum < bNum) return -1 * direction;
        if (aNum > bNum) return 1 * direction;
        return 0;
      }
      
      // Handle string sorting
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return -1 * direction;
      if (aStr > bStr) return 1 * direction;
      return 0;
    });
    
    console.log('Sorting completed. Result length:', copy.length);
    return copy;
  }, [filteredUsers, filters.sortBy, filters.sortOrder]);

  const handleUpdate = async (userId: string, payload: Partial<IUser>) => {
    try {
      await updateUser({ userId, payload }).unwrap();
      await refetch();
    } catch {
      // toast already handled globally if any
    }
  };

  // Only show full loading screen on initial load when no data exists
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            Search, filter, and manage user roles & status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={clsx(
                "h-4 w-4",
                (isLoading || isFetching) && "animate-spin"
              )}
            />
            Refresh
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      search: e.target.value,
                      page: 1,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={filters.role}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, role: value, page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {(Object.values(Role) as Role[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {roleMapper[r].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.isActive}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, isActive: value, page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {(Object.values(IsActive) as IsActive[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {statusMapper[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Per Page</label>
              <Select
                value={String(filters.limit)}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, limit: Number(value), page: 1 }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between mt-6 mb-3">
        <p className="text-sm text-muted-foreground">
          Showing page {pageFromMeta} of {totalPages} • {totalItems} user(s)
        </p>
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Name
                      {filters.sortBy === "name" ? (
                        <span className="text-xs">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort("email")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Email
                      {filters.sortBy === "email" ? (
                        <span className="text-xs">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Created
                      {filters.sortBy === "createdAt" ? (
                        <span className="text-xs">
                          {filters.sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isError ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-red-600">
                      Failed to load users.
                    </td>
                  </tr>
                ) : sortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8" />
                        <p>No users found. Try adjusting filters.</p>
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedUsers.map((u: IUser) => (
                    <tr
                      key={(u._id as unknown as string) || u.email}
                      className="border-b hover:bg-muted/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-xs font-semibold">
                            {u.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{u.name || "—"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3">
                        <div className="font-mono text-sm">
                          {u.email || "—"}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3">{u.phone || "—"}</td>

                      {/* Role */}
                      <td className="px-4 py-3">
                        {u.role && (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium ${
                              roleMapper[u.role].color
                            }`}
                          >
                            {roleMapper[u.role].icon}
                            {roleMapper[u.role].label}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {u.isActive && (
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-medium ${
                              statusMapper[u.isActive].color
                            }`}
                          >
                            {statusMapper[u.isActive].icon}
                            {statusMapper[u.isActive].label}
                          </span>
                        )}
                      </td>

                      {/* CreatedAt */}
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        {(() => {
                          const me = meResponse?.data;
                          const isSelf = me?._id === u._id;
                          const amAdmin = me?.role === Role.ADMIN;
                          const isTargetSuperAdmin =
                            u.role === Role.SUPER_ADMIN;
                          const canModify =
                            !isSelf && !(amAdmin && isTargetSuperAdmin);
                          return (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="h-8 px-2"
                                  disabled={!canModify}
                                >
                                  Manage
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {/* Role updates */}
                                {(() => {
                                  const roleOptions = (
                                    Object.values(Role) as Role[]
                                  ).filter(
                                    (r) => !(amAdmin && r === Role.SUPER_ADMIN)
                                  );
                                  return roleOptions.map((r) => (
                                    <DropdownMenuItem
                                      key={`role-${r}`}
                                      disabled={
                                        isUpdating || u.role === r || !canModify
                                      }
                                      onClick={() =>
                                        canModify &&
                                        handleUpdate(u._id, { role: r })
                                      }
                                    >
                                      Set role: {roleMapper[r].label}
                                    </DropdownMenuItem>
                                  ));
                                })()}
                                {/* Status updates */}
                                <DropdownMenuItem
                                  disabled
                                  className="opacity-60"
                                >
                                  —
                                </DropdownMenuItem>
                                {(Object.values(IsActive) as IsActive[]).map(
                                  (s) => (
                                    <DropdownMenuItem
                                      key={`status-${s}`}
                                      disabled={
                                        isUpdating ||
                                        u.isActive === s ||
                                        !canModify
                                      }
                                      onClick={() =>
                                        canModify &&
                                        handleUpdate(u._id, { isActive: s })
                                      }
                                    >
                                      Set status: {statusMapper[s].label}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          );
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {pageFromMeta} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageFromMeta - 1)}
            disabled={pageFromMeta <= 1 || isLoading || isFetching}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pageFromMeta + 1)}
            disabled={pageFromMeta >= totalPages || isLoading || isFetching}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
