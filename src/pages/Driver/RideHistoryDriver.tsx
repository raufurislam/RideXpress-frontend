// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
//   PaginationEllipsis,
// } from "@/components/ui/pagination";
// import { useGetDriverRideHistoryQuery } from "@/redux/features/driver/driver.api";
// import {
//   MapPin,
//   Car,
//   Bike,
//   Clock,
//   Calendar,
//   Search,
//   Filter,
//   RefreshCw,
//   ChevronDown,
//   User,
//   Phone,
//   Mail,
//   Navigation,
//   Flag,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Loader2,
// } from "lucide-react";
// import { FaBangladeshiTakaSign as TakaIcon } from "react-icons/fa6";
// import { type IRide, type RideStatus, type IUser } from "@/types";
// import { format } from "date-fns";

import { useGetDriverRideHistoryQuery } from "@/redux/features/driver/driver.api";

// // Type for populated ride data
// interface IPopulatedRide extends Omit<IRide, "riderId"> {
//   riderId: IUser;
// }

// // Type guard to check if riderId is populated
// const isPopulatedRide = (
//   ride: IRide | IPopulatedRide
// ): ride is IPopulatedRide => {
//   return typeof ride.riderId === "object" && ride.riderId !== null;
// };

// // Status configuration for badges and icons
// const statusConfig: Record<
//   RideStatus,
//   {
//     label: string;
//     variant:
//       | "default"
//       | "secondary"
//       | "destructive"
//       | "outline"
//       | "success"
//       | "warning"
//       | "pending";
//     icon: React.ComponentType<{ className?: string }>;
//     color: string;
//   }
// > = {
//   REQUESTED: {
//     label: "Requested",
//     variant: "pending",
//     icon: Clock,
//     color: "text-blue-600",
//   },
//   ACCEPTED: {
//     label: "Accepted",
//     variant: "warning",
//     icon: CheckCircle,
//     color: "text-yellow-600",
//   },
//   REJECTED: {
//     label: "Rejected",
//     variant: "destructive",
//     icon: XCircle,
//     color: "text-red-600",
//   },
//   PICKED_UP: {
//     label: "Picked Up",
//     variant: "warning",
//     icon: Navigation,
//     color: "text-orange-600",
//   },
//   IN_TRANSIT: {
//     label: "In Transit",
//     variant: "warning",
//     icon: Car,
//     color: "text-purple-600",
//   },
//   COMPLETED: {
//     label: "Completed",
//     variant: "success",
//     icon: CheckCircle,
//     color: "text-green-600",
//   },
//   CANCELLED: {
//     label: "Cancelled",
//     variant: "destructive",
//     icon: XCircle,
//     color: "text-red-600",
//   },
// };

// // Vehicle type configuration
// const vehicleTypeConfig = {
//   CAR: {
//     label: "Car",
//     icon: Car,
//     color: "text-blue-600",
//   },
//   BIKE: {
//     label: "Bike",
//     icon: Bike,
//     color: "text-green-600",
//   },
// };

// // Status badge component
// const StatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
//   const config = statusConfig[status];
//   const Icon = config.icon;

//   return (
//     <Badge variant={config.variant} className="flex items-center gap-1">
//       <Icon className="h-3 w-3" />
//       {config.label}
//     </Badge>
//   );
// };

// // Vehicle type badge component
// const VehicleTypeBadge: React.FC<{ vehicleType: "CAR" | "BIKE" }> = ({
//   vehicleType,
// }) => {
//   const config = vehicleTypeConfig[vehicleType];
//   const Icon = config.icon;

//   return (
//     <Badge variant="outline" className="flex items-center gap-1">
//       <Icon className={`h-3 w-3 ${config.color}`} />
//       {config.label}
//     </Badge>
//   );
// };

// // Ride details component
// const RideDetails: React.FC<{ ride: IRide | IPopulatedRide }> = ({ ride }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <MapPin className="h-4 w-4 text-muted-foreground" />
//           <span className="text-sm font-medium">Pickup</span>
//         </div>
//         <Button
//           variant="ghost"
//           size="sm"
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="h-6 w-6 p-0"
//         >
//           <ChevronDown
//             className={`h-3 w-3 transition-transform ${
//               isExpanded ? "rotate-180" : ""
//             }`}
//           />
//         </Button>
//       </div>

//       <div className="text-sm text-muted-foreground">
//         {ride.pickupLocation.name}
//       </div>

//       {isExpanded && (
//         <div className="space-y-3 pt-2 border-t">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <Flag className="h-4 w-4 text-muted-foreground" />
//               <span className="text-sm font-medium">Destination</span>
//             </div>
//             <div className="text-sm text-muted-foreground">
//               {ride.destinationLocation.name}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <span className="text-xs text-muted-foreground">Distance</span>
//               <div className="text-sm font-medium">
//                 {ride.distance.toFixed(2)} km
//               </div>
//             </div>
//             <div>
//               <span className="text-xs text-muted-foreground">Fare</span>
//               <div className="text-sm font-medium flex items-center gap-1">
//                 <TakaIcon className="h-3 w-3" />
//                 {ride.fare}
//               </div>
//             </div>
//           </div>

//           {ride.timestamps && (
//             <div>
//               <span className="text-xs text-muted-foreground mb-2 block">
//                 Timeline
//               </span>
//               <div className="space-y-1">
//                 {ride.timestamps.requestedAt && (
//                   <div className="flex justify-between text-xs">
//                     <span>Requested</span>
//                     <span>
//                       {format(
//                         new Date(ride.timestamps.requestedAt),
//                         "MMM dd, HH:mm"
//                       )}
//                     </span>
//                   </div>
//                 )}
//                 {ride.timestamps.acceptedAt && (
//                   <div className="flex justify-between text-xs">
//                     <span>Accepted</span>
//                     <span>
//                       {format(
//                         new Date(ride.timestamps.acceptedAt),
//                         "MMM dd, HH:mm"
//                       )}
//                     </span>
//                   </div>
//                 )}
//                 {ride.timestamps.pickedUpAt && (
//                   <div className="flex justify-between text-xs">
//                     <span>Picked Up</span>
//                     <span>
//                       {format(
//                         new Date(ride.timestamps.pickedUpAt),
//                         "MMM dd, HH:mm"
//                       )}
//                     </span>
//                   </div>
//                 )}
//                 {ride.timestamps.completedAt && (
//                   <div className="flex justify-between text-xs">
//                     <span>Completed</span>
//                     <span>
//                       {format(
//                         new Date(ride.timestamps.completedAt),
//                         "MMM dd, HH:mm"
//                       )}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main component
// export default function RideHistoryDriver() {
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     status: "",
//     vehicleType: "",
//     searchTerm: "",
//   });

//   const { data, isLoading, error, refetch } =
//     useGetDriverRideHistoryQuery(filters);

//   console.log(data);

//   const handleFilterChange = (key: string, value: string | number) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//       page: 1, // Reset to first page when filters change
//     }));
//   };

//   const handlePageChange = (page: number) => {
//     setFilters((prev) => ({ ...prev, page }));
//   };

//   const handleSearch = (searchTerm: string) => {
//     setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       page: 1,
//       limit: 10,
//       status: "",
//       vehicleType: "",
//       searchTerm: "",
//     });
//   };

//   // Temporary test data to verify display logic
//   const testData = {
//     data: [
//       {
//         _id: "68b5d1d90c231863887a54bd",
//         riderId: {
//           _id: "68acb21d5661f07b4603a1de",
//           name: "Rider",
//           email: "rider1@gmail.com",
//           phone: "01648068834",
//         },
//         driverId: "68ad99ef8d22f61d3e43e6ff",
//         pickupLocation: {
//           type: "Point",
//           coordinates: [90.376015, 23.746466],
//           name: "Dhanmondi 32, Dhaka",
//         },
//         destinationLocation: {
//           type: "Point",
//           coordinates: [90.412521, 23.810331],
//           name: "Gulshan 1, Dhaka",
//         },
//         fare: 150,
//         distance: 8.014347106322358,
//         status: "COMPLETED" as RideStatus,
//         vehicleType: "BIKE" as "BIKE",
//         timestamps: {
//           requestedAt: "2025-09-01T17:03:21.010Z",
//           acceptedAt: "2025-09-01T17:09:24.653Z",
//           pickedUpAt: "2025-09-01T17:09:37.314Z",
//           in_transit: "2025-09-01T17:09:38.994Z",
//           completedAt: "2025-09-01T17:09:40.593Z",
//         },
//         createdAt: "2025-09-01T17:03:21.035Z",
//         updatedAt: "2025-09-01T17:09:40.644Z",
//       },
//     ],
//     meta: {
//       page: 1,
//       limit: 5,
//       total: 11,
//       totalPage: 3,
//     },
//   };

//   const rides: (IRide | IPopulatedRide)[] =
//     data?.data?.data ||
//     (testData.data as unknown as (IRide | IPopulatedRide)[]);
//   const meta = data?.data?.meta || testData.meta;

//   // Generate pagination items
//   const generatePaginationItems = () => {
//     if (!meta) return [];

//     const items = [];
//     const currentPage = meta.page;
//     const totalPages = meta.totalPage;

//     // Previous button
//     items.push(
//       <PaginationItem key="prev">
//         <PaginationPrevious
//           onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
//           className={
//             currentPage <= 1
//               ? "pointer-events-none opacity-50"
//               : "cursor-pointer"
//           }
//         />
//       </PaginationItem>
//     );

//     // Page numbers
//     const startPage = Math.max(1, currentPage - 2);
//     const endPage = Math.min(totalPages, currentPage + 2);

//     if (startPage > 1) {
//       items.push(
//         <PaginationItem key={1}>
//           <PaginationLink
//             onClick={() => handlePageChange(1)}
//             isActive={currentPage === 1}
//             className="cursor-pointer"
//           >
//             1
//           </PaginationLink>
//         </PaginationItem>
//       );
//       if (startPage > 2) {
//         items.push(
//           <PaginationItem key="ellipsis1">
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       items.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             onClick={() => handlePageChange(i)}
//             isActive={currentPage === i}
//             className="cursor-pointer"
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         items.push(
//           <PaginationItem key="ellipsis2">
//             <PaginationEllipsis />
//           </PaginationItem>
//         );
//       }
//       items.push(
//         <PaginationItem key={totalPages}>
//           <PaginationLink
//             onClick={() => handlePageChange(totalPages)}
//             isActive={currentPage === totalPages}
//             className="cursor-pointer"
//           >
//             {totalPages}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }

//     // Next button
//     items.push(
//       <PaginationItem key="next">
//         <PaginationNext
//           onClick={() =>
//             currentPage < totalPages && handlePageChange(currentPage + 1)
//           }
//           className={
//             currentPage >= totalPages
//               ? "pointer-events-none opacity-50"
//               : "cursor-pointer"
//           }
//         />
//       </PaginationItem>
//     );

//     return items;
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center h-64 space-y-4">
//         <AlertCircle className="h-12 w-12 text-destructive" />
//         <div className="text-center">
//           <h3 className="text-lg font-semibold">Failed to load ride history</h3>
//           <p className="text-muted-foreground">Please try again later</p>
//           <p className="text-xs text-muted-foreground mt-2">
//             Error: {JSON.stringify(error)}
//           </p>
//         </div>
//         <Button onClick={() => refetch()} variant="outline">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Ride History</h1>
//           <p className="text-muted-foreground">
//             View and manage your past ride records
//           </p>
//         </div>
//         <Button onClick={() => refetch()} variant="outline" size="sm">
//           <RefreshCw className="h-4 w-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Filter className="h-5 w-5" />
//             Filters
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Search</label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search rides..."
//                   value={filters.searchTerm}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Status</label>
//               <Select
//                 value={filters.status}
//                 onValueChange={(value) => handleFilterChange("status", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="All statuses" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">All statuses</SelectItem>
//                   {Object.entries(statusConfig).map(([status, config]) => (
//                     <SelectItem key={status} value={status}>
//                       <div className="flex items-center gap-2">
//                         <config.icon className="h-4 w-4" />
//                         {config.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Vehicle Type Filter */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Vehicle Type</label>
//               <Select
//                 value={filters.vehicleType}
//                 onValueChange={(value) =>
//                   handleFilterChange("vehicleType", value)
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="All vehicles" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="ALL">All vehicles</SelectItem>
//                   {Object.entries(vehicleTypeConfig).map(([type, config]) => (
//                     <SelectItem key={type} value={type}>
//                       <div className="flex items-center gap-2">
//                         <config.icon className="h-4 w-4" />
//                         {config.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Clear Filters */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">&nbsp;</label>
//               <Button
//                 onClick={clearFilters}
//                 variant="outline"
//                 className="w-full"
//                 disabled={
//                   !filters.status && !filters.vehicleType && !filters.searchTerm
//                 }
//               >
//                 Clear Filters
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Stats */}
//       {meta && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                 <span className="text-sm font-medium">Total Rides</span>
//               </div>
//               <div className="text-2xl font-bold">{meta.total}</div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2">
//                 <CheckCircle className="h-4 w-4 text-green-600" />
//                 <span className="text-sm font-medium">Completed</span>
//               </div>
//               <div className="text-2xl font-bold text-green-600">
//                 {
//                   rides.filter(
//                     (ride: IRide | IPopulatedRide) =>
//                       ride.status === "COMPLETED"
//                   ).length
//                 }
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2">
//                 <XCircle className="h-4 w-4 text-red-600" />
//                 <span className="text-sm font-medium">Cancelled</span>
//               </div>
//               <div className="text-2xl font-bold text-red-600">
//                 {
//                   rides.filter(
//                     (ride: IRide | IPopulatedRide) =>
//                       ride.status === "CANCELLED"
//                   ).length
//                 }
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-2">
//                 <TakaIcon className="h-4 w-4 text-green-600" />
//                 <span className="text-sm font-medium">Total Earnings</span>
//               </div>
//               <div className="text-2xl font-bold text-green-600">
//                 {rides
//                   .filter(
//                     (ride: IRide | IPopulatedRide) =>
//                       ride.status === "COMPLETED"
//                   )
//                   .reduce(
//                     (sum: number, ride: IRide | IPopulatedRide) =>
//                       sum + ride.fare,
//                     0
//                   )
//                   .toLocaleString()}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Rides Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Ride Records</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {rides.length === 0 ? (
//             <div className="text-center py-8">
//               <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No rides found</h3>
//               <p className="text-muted-foreground">
//                 {filters.searchTerm || filters.status || filters.vehicleType
//                   ? "No rides match your current filters"
//                   : "You haven't completed any rides yet"}
//               </p>
//               {/* Debug info */}
//               <div className="mt-4 p-4 bg-muted rounded-lg text-left text-xs">
//                 <p>
//                   <strong>Debug Info:</strong>
//                 </p>
//                 <p>Data: {JSON.stringify(data, null, 2)}</p>
//                 <p>Rides length: {rides.length}</p>
//                 <p>Meta: {JSON.stringify(meta, null, 2)}</p>
//               </div>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Ride Details</TableHead>
//                     <TableHead>Rider</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Vehicle</TableHead>
//                     <TableHead>Fare</TableHead>
//                     <TableHead>Date</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {rides.map((ride: IRide | IPopulatedRide) => (
//                     <TableRow key={ride._id}>
//                       <TableCell>
//                         <RideDetails ride={ride} />
//                       </TableCell>
//                       <TableCell>
//                         <div className="space-y-1">
//                           <div className="flex items-center gap-2">
//                             <User className="h-4 w-4 text-muted-foreground" />
//                             <span className="font-medium">
//                               {isPopulatedRide(ride)
//                                 ? (ride as IPopulatedRide).riderId.name
//                                 : "Unknown"}
//                             </span>
//                           </div>
//                           {isPopulatedRide(ride) && (
//                             <>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <Phone className="h-3 w-3" />
//                                 {(ride as IPopulatedRide).riderId.phone ||
//                                   "N/A"}
//                               </div>
//                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                                 <Mail className="h-3 w-3" />
//                                 {(ride as IPopulatedRide).riderId.email}
//                               </div>
//                             </>
//                           )}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <StatusBadge status={ride.status} />
//                       </TableCell>
//                       <TableCell>
//                         <VehicleTypeBadge vehicleType={ride.vehicleType} />
//                       </TableCell>
//                       <TableCell>
//                         <div className="flex items-center gap-1 font-medium">
//                           <TakaIcon className="h-4 w-4" />
//                           {ride.fare.toLocaleString()}
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         <div className="text-sm">
//                           <div className="font-medium">
//                             {format(new Date(ride.createdAt), "MMM dd, yyyy")}
//                           </div>
//                           <div className="text-muted-foreground">
//                             {format(new Date(ride.createdAt), "HH:mm")}
//                           </div>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {/* Pagination */}
//               {meta && meta.totalPage > 1 && (
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-muted-foreground">
//                     Showing {(meta.page - 1) * meta.limit + 1} to{" "}
//                     {Math.min(meta.page * meta.limit, meta.total)} of{" "}
//                     {meta.total} rides
//                   </div>
//                   <Pagination>
//                     <PaginationContent>
//                       {generatePaginationItems()}
//                     </PaginationContent>
//                   </Pagination>
//                 </div>
//               )}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

export default function RideHistoryDriver() {
  const { data } = useGetDriverRideHistoryQuery();
  console.log(data);
  return (
    <div>
      <h1>This is RideHistoryDriver component</h1>
    </div>
  );
}
