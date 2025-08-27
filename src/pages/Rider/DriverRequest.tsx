import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VEHICLE_TYPE } from "@/types/driver.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { z } from "zod";
import {
  useApplyDriverMutation,
  useDriverApplicationQuery,
} from "@/redux/features/driver/driver.api";
import { useEffect } from "react";
import {
  useUpdateUserMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";

const driverRequestSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export default function DriverRequest() {
  const location = useLocation();
  const basicInfo = location.state; // { name, email, password }
  console.log("Driver request", basicInfo);

  const [applyDriver, { isLoading, isError, isSuccess }] =
    useApplyDriverMutation();

  const { data: userInfoResponse } = useUserInfoQuery();

  const [updateUser] = useUpdateUserMutation();

  const { data: driverApplications, refetch: refetchDriverApplications } =
    useDriverApplicationQuery();

  const form = useForm<z.infer<typeof driverRequestSchema>>({
    resolver: zodResolver(driverRequestSchema),
    defaultValues: {
      vehicleType: "",
      vehicleModel: "",
      licenseNumber: "",
      vehicleNumber: "",
      phone: "",
      address: "",
    },
  });

  // Prefill phone and address from profile if available
  useEffect(() => {
    const profile = userInfoResponse?.data;
    if (profile) {
      form.reset({
        vehicleType: form.getValues("vehicleType"),
        vehicleModel: form.getValues("vehicleModel"),
        licenseNumber: form.getValues("licenseNumber"),
        vehicleNumber: form.getValues("vehicleNumber"),
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfoResponse]);

  const userRole = userInfoResponse?.data?.role;
  const myStatus = driverApplications?.data?.data?.find(
    (d) => d.userId === userInfoResponse?.data?._id
  )?.status;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      // Update user phone/address if provided
      const user = userInfoResponse?.data;
      if (user && (data.phone || data.address)) {
        await updateUser({
          userId: user._id,
          payload: { phone: data.phone, address: data.address },
        }).unwrap();
      }
      const driverPayload = {
        vehicleType: data.vehicleType,
        vehicleModel: data.vehicleModel,
        licenseNumber: data.licenseNumber,
        vehicleNumber: data.vehicleNumber,
      };
      const res = await applyDriver(driverPayload).unwrap();
      console.log("Driver application submitted successfully:", res);
      await refetchDriverApplications();
    } catch (e) {
      console.error("Failed to submit driver application:", e);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto px-5 mt-16">
      {userRole === "DRIVER" || myStatus === "PENDING" ? (
        <Card className="overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle>
              {userRole === "DRIVER"
                ? "You are approved as a Driver"
                : "Your application is under review"}
            </CardTitle>
            <CardDescription>
              {userRole === "DRIVER"
                ? "Welcome aboard. You can access driver features in your dashboard."
                : "Thanks for applying! Our team is verifying your details. This typically takes 24–48 hours."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="h-2 w-full max-w-sm overflow-hidden rounded-full bg-muted">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-amber-500/70" />
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Keep your phone reachable for a quick verification call
                </li>
                <li>• You can continue riding while you wait</li>
                <li>• We’ll notify you once you’re approved</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            {userRole !== "DRIVER" ? (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Status
              </Button>
            ) : null}
          </CardFooter>
        </Card>
      ) : (
        <div>
          <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600 mb-6">
            <p className="text-sm">
              <TriangleAlert
                className="me-3 -mt-0.5 inline-flex opacity-60"
                size={16}
                aria-hidden="true"
              />
              You must complete the information below to request driver status.
              After verification, your role will be set to Driver. If you do not
              provide your information, you can continue using our website as a
              User.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Driver Application</CardTitle>
              <CardDescription>
                Please provide your vehicle information to apply for driver
                status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isError ? (
                <div className="mb-4 rounded-md border border-red-500/50 px-4 py-2 text-red-600 text-sm">
                  Failed to submit application. Please try again.
                </div>
              ) : null}
              {isSuccess ? (
                <div className="mb-4 rounded-md border border-emerald-500/50 px-4 py-2 text-emerald-600 text-sm">
                  Application submitted successfully.
                </div>
              ) : null}
              <Form {...form}>
                <form
                  id="driver-application-form"
                  className="space-y-5"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  {/* Vehicle Type */}
                  <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(VEHICLE_TYPE).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Honda Civic, Toyota Camry"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>License Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your driver's license number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your vehicle registration number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <div className="rounded-md border border-blue-500/50 px-4 py-3 text-blue-600">
                <p className="text-sm">
                  <InfoIcon
                    className="me-3 -mt-0.5 inline-flex opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  After approval, your role will be updated to DRIVER.
                </p>
              </div>
              {/* <p className="text-xs text-muted-foreground">
              After approval, your role will be updated to DRIVER.
            </p> */}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
