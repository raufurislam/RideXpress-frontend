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
import { VEHICLE_TYPE } from "@/constants/vehicleType";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import z from "zod";

const driverRequestSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
});

export default function DriverRequest() {
  const location = useLocation();
  const basicInfo = location.state; // { name, email, password }
  console.log("Driver request", basicInfo);

  const form = useForm<z.infer<typeof driverRequestSchema>>({
    resolver: zodResolver(driverRequestSchema),
    defaultValues: {
      vehicleType: "",
      vehicleModel: "",
      licenseNumber: "",
      vehicleNumber: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    console.log(data);
  };
  return (
    <div className="w-full max-w-2xl mx-auto px-5 mt-16">
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
            Please provide your vehicle information to apply for driver status
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button
                type="submit"
                // disabled={isLoading}
                className="w-full"
              >
                {/* {isLoading ? "Submitting..." : "Submit Application"} */}
                submit
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            After approval, your role will be updated to DRIVER.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
