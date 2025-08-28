import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useGetAllUsersQuery } from "@/redux/features/auth/auth.api";
import { ArrowUpDown, Loader2, RefreshCw, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type IUser } from "@/types";
import { roleMapper, statusMapper } from "@/utils/mappers";

export default function AllUser() {
  const { data, isLoading, isFetching, refetch, isError } = useGetAllUsersQuery(
    {}
  );
  const users = data?.data ?? [];
  const meta = data?.meta;

  console.log(users); //data below. this data just show on my table this time
  /**
(4) [{…}, {…}, {…}, {…}]
0
0
: 
address
: 
"Nandina"
auths
: 
[{…}]
createdAt
: 
"2025-08-26T11:26:39.806Z"
email
: 
"driver1@gmail.com"
isActive
: 
"ACTIVE"
isDeleted
: 
false
isVerified
: 
true
name
: 
"Driver1"
password
: 
"$2b$10$RHWgArhOxchB54RcCMQKE.KQWu9YZl3yQGbx.mC3E6dbkT1D0caIS"
phone
: 
"01700000003"
role
: 
"DRIVER"
updatedAt
: 
"2025-08-26T21:06:12.687Z"
_id
: 
"68ad99ef8d22f61d3e43e6ff"
*/

  const totalItems = meta?.total ?? users.length;
  const pageFromMeta = meta?.page ?? 1;
  const limitFromMeta = meta?.limit ?? 10;
  const totalPages = Math.max(1, Math.ceil(totalItems / limitFromMeta));

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
          <Button variant="outline">Clear Filters</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {pageFromMeta} of {totalPages} • {totalItems} user(s)
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
                    // onClick={() => toggleSort("name")}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      Name <ArrowUpDown className="h-3.5 w-3.5" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 cursor-pointer select-none"
                    // onClick={() => toggleSort("email")}
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
                    // onClick={() => toggleSort("createdAt")}
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
                        <Button variant="outline">Clear Filters</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u: IUser) => (
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
                      {/* <td className="px-4 py-3 font-medium">{u.role || "—"}</td> */}

                      {/* Status */}
                      {/* <td className="px-4 py-3 font-medium">
                        {u.isActive || "—"}
                      </td> */}

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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4">
            <div className="text-sm text-muted-foreground">
              {totalItems} total • Page {pageFromMeta} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
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
          </CardFooter> */}
        </CardContent>
      </Card>
    </div>
  );
}
