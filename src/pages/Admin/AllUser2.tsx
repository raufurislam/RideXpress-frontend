// app/(admin)/users/AllUser.tsx OR wherever you keep it
import { useEffect, useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import type { IUser } from "@/types";
import { Role, IsActive } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  UserCog,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

// Small helper for debounce
function useDebounced<T>(value: T, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ROLE_OPTIONS = Object.values(Role) as (keyof typeof Role)[];
const STATUS_OPTIONS = [
  IsActive.ACTIVE,
  IsActive.SUSPENDED,
  IsActive.BLOCKED,
] as const;

const roleDisabledReason = (
  myRole: Role | undefined,
  target: IUser | undefined
) => {
  if (!myRole || !target) return null;

  // You cannot edit SUPER_ADMIN unless you are SUPER_ADMIN
  if (target.role === Role.SUPER_ADMIN && myRole !== Role.SUPER_ADMIN) {
    return "Only SUPER_ADMIN can change SUPER_ADMIN role";
  }
  // Optional: Prevent self-role change unless SUPER_ADMIN
  if (myRole !== Role.SUPER_ADMIN && target._id === undefined) {
    return "Cannot change your own role";
  }
  return null;
};

export default function AllUser() {
  const ALL_OPTION = "ALL";

  // Filters & sorting
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 500);

  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Current user (for permissions)
  const { data: me } = useUserInfoQuery();
  const myRole = me?.data?.role as Role | undefined;
  const myId = me?.data?._id;

  const { data, isLoading, isError, refetch, isFetching } = useGetAllUsersQuery(
    {
      search: debouncedSearch || undefined,
      role: role || undefined,
      isActive: status || undefined,
      sortBy,
      sortOrder,
      page,
      limit,
    }
  );

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  type MetaShape = { page: number; limit: number; total: number };
  const users = useMemo(() => (data?.data ?? []) as IUser[], [data]);
  const meta = useMemo<MetaShape>(
    () =>
      (data?.meta ?? {
        page: 1,
        limit,
        total: (data?.data ?? []).length,
      }) as MetaShape,
    [data, limit]
  );

  const totalItems = meta.total ?? users.length;
  const pageFromMeta = meta.page ?? page;
  const limitFromMeta = meta.limit ?? limit;
  const totalPages = Math.max(1, Math.ceil(totalItems / limitFromMeta));

  const handleClear = () => {
    setSearch("");
    setRole("");
    setStatus("");
    setPage(1);
    setSortBy("createdAt");
    setSortOrder("desc");
  };

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((p) => (p === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const confirmChange = async (
    user: IUser,
    payload: Partial<IUser>,
    text: string
  ) => {
    try {
      await updateUser({ userId: user._id as string, payload }).unwrap();
      toast.success(text);
      refetch();
    } catch (e: unknown) {
      toast.error("Update failed");
      console.error(e);
    }
  };

  const onChangeRole = (user: IUser, nextRole: Role) => {
    // Permission guards
    if (user._id === myId && myRole !== Role.SUPER_ADMIN) {
      return toast.error("You cannot change your own role.");
    }
    if (user.role === Role.SUPER_ADMIN && myRole !== Role.SUPER_ADMIN) {
      return toast.error("Only SUPER_ADMIN can change SUPER_ADMIN role.");
    }

    const proceed = window.confirm(
      `Change role for ${user.email} from ${user.role} → ${nextRole}?`
    );
    if (!proceed) return;
    confirmChange(user, { role: nextRole }, "Role updated");
  };

  const onChangeStatus = (user: IUser, nextStatus: IsActive) => {
    const critical =
      nextStatus === IsActive.BLOCKED || nextStatus === IsActive.SUSPENDED;
    const msg =
      `Set status for ${user.email} to ${nextStatus}?` +
      (critical ? " This may restrict account access." : "");
    const proceed = window.confirm(msg);
    if (!proceed) return;
    confirmChange(user, { isActive: nextStatus }, "Status updated");
  };

  return (
    <div className="container mx-auto max-w-7xl p-6 space-y-6">
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
          <Button variant="outline" onClick={handleClear}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Search by email and filter by role or status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Search by email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., user@example.com"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role */}
            <Select
              value={role || ALL_OPTION}
              onValueChange={(v) => {
                setRole(v === ALL_OPTION ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>All roles</SelectItem>
                {ROLE_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status */}
            <Select
              value={status || ALL_OPTION}
              onValueChange={(v) => {
                setStatus(v === ALL_OPTION ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_OPTION}>All status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Page size */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Page size</label>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Sort By */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={sortBy}
                onValueChange={(v) => {
                  setSortBy(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { k: "createdAt", t: "Created" },
                    { k: "name", t: "Name" },
                    { k: "email", t: "Email" },
                    { k: "role", t: "Role" },
                    { k: "isActive", t: "Status" },
                  ].map((opt) => (
                    <SelectItem key={opt.k} value={opt.k}>
                      {opt.t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={sortOrder}
                onValueChange={(v) => {
                  setSortOrder(v as "asc" | "desc");
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {pageFromMeta} of {totalPages} • {totalItems} user(s)
        </p>
        <p className="text-sm text-muted-foreground">
          Sorted by <span className="font-medium">{sortBy}</span> ({sortOrder})
        </p>
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
                    onClick={() => toggleSort("name")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Name <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort("email")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Email <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Created <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Loading users…
                      </p>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-red-600">
                      Failed to load users.
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Search className="h-8 w-8" />
                        <p>No users found. Try adjusting filters.</p>
                        <Button variant="outline" onClick={handleClear}>
                          Clear Filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u: IUser) => {
                    const roleBlockMsg = roleDisabledReason(myRole, u);
                    const cannotChangeRole =
                      !!roleBlockMsg ||
                      (u._id === myId && myRole !== Role.SUPER_ADMIN);

                    return (
                      <tr
                        key={(u._id as unknown as string) || u.email}
                        className="border-b hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted grid place-items-center text-xs font-semibold">
                              {u.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {u.name || "—"}
                              </span>
                              {u.isVerified ? (
                                <span className="text-[11px] text-emerald-600 inline-flex items-center gap-1">
                                  <ShieldCheck className="h-3 w-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="text-[11px] text-amber-600 inline-flex items-center gap-1">
                                  <ShieldAlert className="h-3 w-3" />
                                  Unverified
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-mono text-sm">
                            {u.email || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3">{u.phone || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={clsx(
                                "uppercase",
                                u.role === Role.SUPER_ADMIN &&
                                  "border-purple-500",
                                u.role === Role.ADMIN && "border-blue-500",
                                u.role === Role.DRIVER && "border-emerald-500",
                                u.role === Role.RIDER && "border-gray-400"
                              )}
                            >
                              {u.role}
                            </Badge>
                            <Select
                              value={u.role}
                              onValueChange={(val) =>
                                onChangeRole(u, val as Role)
                              }
                              disabled={isUpdating || cannotChangeRole}
                            >
                              <SelectTrigger className="w-[160px]">
                                <UserCog className="h-4 w-4 mr-2 opacity-70" />
                                <SelectValue placeholder="Change role" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.map((r) => (
                                  <SelectItem
                                    key={r}
                                    value={r}
                                    disabled={
                                      r === Role.SUPER_ADMIN &&
                                      myRole !== Role.SUPER_ADMIN
                                    }
                                  >
                                    {r}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {cannotChangeRole && (
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {roleBlockMsg ?? "Cannot change your own role"}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              className={clsx(
                                "uppercase",
                                u.isActive === IsActive.ACTIVE &&
                                  "bg-emerald-600",
                                u.isActive === IsActive.SUSPENDED &&
                                  "bg-amber-600",
                                u.isActive === IsActive.BLOCKED && "bg-red-600"
                              )}
                            >
                              {u.isActive}
                            </Badge>
                            <Select
                              value={u.isActive ?? IsActive.ACTIVE}
                              onValueChange={(val) =>
                                onChangeStatus(u, val as IsActive)
                              }
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                  <SelectItem key={s} value={s}>
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
            <div className="text-sm text-muted-foreground">
              {totalItems} total • Page {pageFromMeta} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              {/* Numbered pagination (shadcn style) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageFromMeta <= 1 || isFetching || isLoading}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages })
                .slice(0, 7)
                .map((_, idx) => {
                  const pageNumber = idx + 1;
                  if (totalPages > 7) {
                    // Show first, last, current +/-1, and ellipsis
                    const isFirst = pageNumber === 1;
                    const isLast = pageNumber === totalPages;
                    const isNearCurrent =
                      Math.abs(pageNumber - pageFromMeta) <= 1;
                    const shouldShow = isFirst || isLast || isNearCurrent;
                    if (!shouldShow) {
                      if (
                        (pageNumber === 2 && pageFromMeta > 3) ||
                        (pageNumber === 6 && pageFromMeta < totalPages - 2)
                      ) {
                        return (
                          <Button
                            key={`ellipsis-${pageNumber}`}
                            variant="ghost"
                            size="sm"
                            disabled
                          >
                            …
                          </Button>
                        );
                      }
                      return null;
                    }
                  }
                  const isActive = pageNumber === pageFromMeta;
                  return (
                    <Button
                      key={pageNumber}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNumber)}
                      disabled={isFetching || isLoading}
                      className="min-w-9"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageFromMeta >= totalPages || isFetching || isLoading}
                className="px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
}
