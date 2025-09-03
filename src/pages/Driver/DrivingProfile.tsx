import { useState, useEffect } from "react";
import {
  useGetDriverMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/redux/features/driver/driver.api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Edit3, Save, X, Car } from "lucide-react";
import type {
  IUpdateMyDriverProfile,
  Availability,
  VehicleType,
} from "@/types";

export default function DrivingProfile() {
  const { data: driverProfile, refetch } = useGetDriverMyProfileQuery();
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();
  const [isEditing, setIsEditing] = useState(false);

  // Local state for form fields
  const [formData, setFormData] = useState({
    vehicleType: "CAR" as VehicleType,
    vehicleModel: "",
    vehicleNumber: "",
    licenseNumber: "",
    availability: "AVAILABLE" as Availability,
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (driverProfile) {
      setFormData({
        vehicleType: driverProfile.vehicleType || "CAR",
        vehicleModel: driverProfile.vehicleModel || "",
        vehicleNumber: driverProfile.vehicleNumber || "",
        licenseNumber: driverProfile.licenseNumber || "",
        availability: driverProfile.availability || "AVAILABLE",
      });
    }
  }, [driverProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to current profile
    if (driverProfile) {
      setFormData({
        vehicleType: driverProfile.vehicleType || "CAR",
        vehicleModel: driverProfile.vehicleModel || "",
        vehicleNumber: driverProfile.vehicleNumber || "",
        licenseNumber: driverProfile.licenseNumber || "",
        availability: driverProfile.availability || "AVAILABLE",
      });
    }
  };

  const handleSave = async () => {
    // Validation
    if (
      !formData.vehicleModel.trim() ||
      !formData.vehicleNumber.trim() ||
      !formData.licenseNumber.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateMyProfile({
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehicleNumber: formData.vehicleNumber,
        licenseNumber: formData.licenseNumber,
        availability: formData.availability,
      } as IUpdateMyDriverProfile).unwrap();

      toast.success("Profile updated successfully");
      setIsEditing(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (!driverProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading driver profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Car className="h-6 w-6 text-primary" /> Driving Profile
          </CardTitle>
          <CardDescription>
            Manage your vehicle details and availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  disabled={!isEditing}
                  value={formData.vehicleType}
                  onValueChange={(value: VehicleType) =>
                    handleInputChange("vehicleType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAR">Car</SelectItem>
                    <SelectItem value="BIKE">Bike</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  disabled={!isEditing}
                  value={formData.availability}
                  onValueChange={(value: Availability) =>
                    handleInputChange("availability", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                    {/* <SelectItem value="ON_TRIP">On Trip</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>

              {/* Vehicle Model */}
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) =>
                    handleInputChange("vehicleModel", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="e.g. Tesla X"
                />
              </div>

              {/* Vehicle Number */}
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) =>
                    handleInputChange("vehicleNumber", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="e.g. 123456"
                />
              </div>

              {/* License Number */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  disabled={!isEditing}
                  placeholder="e.g. AB1234"
                />
              </div>
            </div>

            {/* Status + Earnings */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Badge variant="secondary">{driverProfile.status}</Badge>
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Earnings: ${driverProfile.earnings}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              {!isEditing ? (
                <Button
                  type="button"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
