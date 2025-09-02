import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRideRequestMutation } from "@/redux/features/ride/ride.api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IRideRequest } from "@/types";

type VehicleType = "CAR" | "BIKE";

const formSchema = z.object({
  pickupQuery: z.string().min(3, "Type at least 3 characters"),
  destinationQuery: z.string().min(3, "Type at least 3 characters"),
  pickupLocation: z
    .object({
      type: z.literal("Point").default("Point"),
      coordinates: z.tuple([z.number(), z.number()]), // [lat, lng]
      name: z.string(),
    })
    .optional(),
  destinationLocation: z
    .object({
      type: z.literal("Point").default("Point"),
      coordinates: z.tuple([z.number(), z.number()]),
      name: z.string(),
    })
    .optional(),
  vehicleType: z.enum(["CAR", "BIKE"] as const),
  paymentMethod: z.enum(["ONLINE", "CASH"] as const).default("ONLINE"),
});

type FormValues = z.infer<typeof formSchema>;

interface PlaceSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

function calculateDistanceInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

function calculateFare(distanceInKm: number, vehicleType: VehicleType): number {
  let baseFare = 0;
  let ratePerKm = 0;
  switch (vehicleType) {
    case "CAR":
      baseFare = 50;
      ratePerKm = 30;
      break;
    case "BIKE":
      baseFare = 30;
      ratePerKm = 15;
      break;
  }
  return Math.round(baseFare + ratePerKm * distanceInKm);
}

export default function RequestRide() {
  const navigate = useNavigate();
  const [pickupSuggestions, setPickupSuggestions] = useState<PlaceSuggestion[]>(
    []
  );
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    PlaceSuggestion[]
  >([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);

  const [rideRequest, { isLoading }] = useRideRequestMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as never,
    defaultValues: {
      pickupQuery: "",
      destinationQuery: "",
      vehicleType: "CAR",
      paymentMethod: "ONLINE",
    },
  });

  const selectedVehicle = form.watch("vehicleType");
  const pickupLocation = form.watch("pickupLocation");
  const destinationLocation = form.watch("destinationLocation");

  useEffect(() => {
    if (pickupLocation && destinationLocation && selectedVehicle) {
      const [plat, plon] = pickupLocation.coordinates;
      const [dlat, dlon] = destinationLocation.coordinates;
      const km = calculateDistanceInKm(plat, plon, dlat, dlon);
      setDistanceKm(km);
      setEstimatedFare(calculateFare(km, selectedVehicle));
    } else {
      setDistanceKm(null);
      setEstimatedFare(null);
    }
  }, [pickupLocation, destinationLocation, selectedVehicle]);

  const fetchSuggestions = useRef(() => {
    let timer: number | undefined;
    return async (query: string, setter: (v: PlaceSuggestion[]) => void) => {
      window.clearTimeout(timer);
      if (!query || query.length < 3) {
        setter([]);
        return;
      }
      timer = window.setTimeout(async () => {
        try {
          const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(
            query
          )}&format=json&addressdetails=1&limit=6&countrycodes=bd&accept-language=bn,en`;
          const res = await fetch(url, {
            headers: {
              "User-Agent": "RideExpress-Frontend/1.0 (Educational)",
              Referer: window.location.origin,
            },
          });
          const data: PlaceSuggestion[] = await res.json();
          setter(data);
        } catch {
          setter([]);
        }
      }, 350);
    };
  }).current();

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    if (
      !values.pickupLocation ||
      !values.destinationLocation ||
      !values.vehicleType
    ) {
      toast.error("Please select pickup, destination and vehicle type");
      return;
    }

    const payload: IRideRequest = {
      pickupLocation: values.pickupLocation,
      destinationLocation: values.destinationLocation,
      vehicleType: values.vehicleType,
    };

    try {
      const res = await rideRequest(payload).unwrap();
      toast.success(res.message || "Ride requested successfully");
      form.reset();
      setPickupSuggestions([]);
      setDestinationSuggestions([]);
      setDistanceKm(null);
      setEstimatedFare(null);
      navigate("/rider/active-ride-rider");
    } catch (e) {
      const maybe = e as { data?: { message?: string } };
      toast.error(maybe?.data?.message || "Failed to request ride");
    }
  };

  const Summary = useMemo(() => {
    return (
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground">Distance</div>
          <div className="font-semibold">
            {distanceKm ? `${distanceKm.toFixed(2)} km` : "—"}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Estimated fare</div>
          <div className="font-semibold">
            {estimatedFare ? `৳ ${estimatedFare}` : "—"}
          </div>
        </div>
      </div>
    );
  }, [distanceKm, estimatedFare]);

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Request a ride</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                onSubmit as SubmitHandler<FormValues>
              )}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pickupQuery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup location</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="e.g. Dhanmondi 27, Dhaka"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              fetchSuggestions(
                                e.target.value,
                                setPickupSuggestions
                              );
                            }}
                          />
                          {pickupSuggestions.length > 0 && (
                            <div className="rounded-md border bg-background shadow-sm max-h-56 overflow-auto">
                              {pickupSuggestions.map((s) => (
                                <button
                                  type="button"
                                  key={`${s.lat}-${s.lon}-${s.display_name}`}
                                  className="w-full text-left px-3 py-2 hover:bg-accent"
                                  onClick={() => {
                                    form.setValue(
                                      "pickupQuery",
                                      s.display_name
                                    );
                                    form.setValue("pickupLocation", {
                                      type: "Point",
                                      coordinates: [
                                        Number(s.lat),
                                        Number(s.lon),
                                      ], // [lat, lng]
                                      name: s.display_name,
                                    });
                                    setPickupSuggestions([]);
                                  }}
                                >
                                  {s.display_name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationQuery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="e.g. Shahbagh, Dhaka"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e);
                              fetchSuggestions(
                                e.target.value,
                                setDestinationSuggestions
                              );
                            }}
                          />
                          {destinationSuggestions.length > 0 && (
                            <div className="rounded-md border bg-background shadow-sm max-h-56 overflow-auto">
                              {destinationSuggestions.map((s) => (
                                <button
                                  type="button"
                                  key={`${s.lat}-${s.lon}-${s.display_name}`}
                                  className="w-full text-left px-3 py-2 hover:bg-accent"
                                  onClick={() => {
                                    form.setValue(
                                      "destinationQuery",
                                      s.display_name
                                    );
                                    form.setValue("destinationLocation", {
                                      type: "Point",
                                      coordinates: [
                                        Number(s.lat),
                                        Number(s.lon),
                                      ],
                                      name: s.display_name,
                                    });
                                    setDestinationSuggestions([]);
                                  }}
                                >
                                  {s.display_name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vehicleType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CAR">Car</SelectItem>
                          <SelectItem value="BIKE">Bike</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment method</FormLabel>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            value="ONLINE"
                            checked={field.value === "ONLINE"}
                            onChange={() => field.onChange("ONLINE")}
                          />
                          Online (demo)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            value="CASH"
                            checked={field.value === "CASH"}
                            onChange={() => field.onChange("CASH")}
                          />
                          Cash
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-md border p-4 bg-muted/30">{Summary}</div>

              <div className="flex items-center justify-end gap-3">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Requesting..." : "Request ride"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
