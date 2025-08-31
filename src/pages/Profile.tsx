/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useUserInfoQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
} from "@/redux/features/auth/auth.api";
import {
  Camera,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Shield,
  Key,
  Eye,
  EyeOff,
  Link,
} from "lucide-react";
import { toast } from "sonner";

// Validation schemas
const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  picture: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const passwordUpdateSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const setPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
type PasswordUpdateData = z.infer<typeof passwordUpdateSchema>;
type SetPasswordData = z.infer<typeof setPasswordSchema>;

export default function Profile() {
  const { data: userData, refetch } = useUserInfoQuery(undefined);
  const [updateUser] = useUpdateUserMutation();
  const [changePassword] = useChangePasswordMutation();
  const [setPassword] = useSetPasswordMutation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showSetConfirmPassword, setShowSetConfirmPassword] = useState(false);

  const user = userData?.data;
  const isGoogleUser = user?.auths?.some((auth) => auth.provider === "google");
  // Check if user has a password set - this will determine which password form to show
  const hasPassword = Boolean(user?.password && user.password.length > 0);

  // Profile form
  const profileForm = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      picture: "",
    },
  });

  // Password form for resetting existing password
  const passwordForm = useForm<PasswordUpdateData>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Set password form for users without password
  const setPasswordForm = useForm<SetPasswordData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        picture: user.picture || "",
      });
    }
  }, [user, profileForm]);

  // Get user's first character for avatar fallback
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Handle profile update
  const onProfileSubmit = async (data: ProfileUpdateData) => {
    console.log("Profile form submitted with data:", data);
    console.log("isEditingProfile state:", isEditingProfile);

    if (!isEditingProfile) {
      console.log("Form submitted but not in edit mode, preventing submission");
      return; // Prevent submission if not in edit mode
    }

    if (!user?._id) return;

    // Clean up the data - remove empty strings for optional fields
    const cleanedData = {
      ...data,
      phone: data.phone || undefined,
      address: data.address || undefined,
      picture: data.picture || undefined,
    };

    console.log("Cleaned data being sent:", cleanedData);

    try {
      await updateUser({
        userId: user._id,
        payload: cleanedData,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
      refetch();
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to update profile";
      toast.error(errorMessage);
    }
  };

  // Handle password change (for users who already have a password)
  const onPasswordSubmit = async (data: PasswordUpdateData) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      setIsEditingPassword(false);
      passwordForm.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to update password";
      toast.error(errorMessage);
    }
  };

  // Handle setting password for users without password
  const onSetPasswordSubmit = async (data: SetPasswordData) => {
    try {
      await setPassword({
        password: data.password,
      }).unwrap();

      toast.success("Password set successfully!");
      setIsEditingPassword(false);
      setPasswordForm.reset();
      setShowSetPassword(false);
      setShowSetConfirmPassword(false);
      refetch(); // Refresh user data to update hasPassword status
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to set password";
      toast.error(errorMessage);
    }
  };

  // Handle image URL update
  const handleImageUrlUpdate = (url: string) => {
    profileForm.setValue("picture", url);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your account settings, personal information, and security
            preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-6 w-6 text-primary" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription className="text-base">
              Update your personal details and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="h-28 w-28 rounded-full ring-2 ring-primary/30 shadow-md overflow-hidden">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="bg-primary/20 text-primary font-bold text-4xl flex items-center justify-center h-full w-full">
                      {getUserInitial(user.name)}
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                {isEditingProfile && (
                  <div className="absolute inset-0 bg-black/25 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Picture URL Input */}
              <div className="w-full max-w-sm space-y-2">
                <Label
                  htmlFor="picture"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Link className="h-4 w-4" /> Profile Picture URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="picture"
                    {...profileForm.register("picture")}
                    disabled={!isEditingProfile}
                    placeholder="Enter image URL (e.g., imgbb link)"
                  />
                  {isEditingProfile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleImageUrlUpdate("")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {profileForm.formState.errors.picture && (
                  <p className="text-sm text-red-500">
                    {profileForm.formState.errors.picture.message}
                  </p>
                )}
                {user.picture && (
                  <p className="text-xs text-muted-foreground">
                    Current: {user.picture}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...profileForm.register("name")}
                    disabled={!isEditingProfile}
                    className={
                      !isEditingProfile
                        ? "bg-muted/50"
                        : "focus:ring-2 focus:ring-primary/20"
                    }
                    placeholder="Enter your full name"
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {profileForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    {...profileForm.register("phone")}
                    disabled={!isEditingProfile}
                    className={
                      !isEditingProfile
                        ? "bg-muted/50"
                        : "focus:ring-2 focus:ring-primary/20"
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address
                  </Label>
                  <Input
                    id="address"
                    {...profileForm.register("address")}
                    disabled={!isEditingProfile}
                    className={
                      !isEditingProfile
                        ? "bg-muted/50"
                        : "focus:ring-2 focus:ring-primary/20"
                    }
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Role and Status */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  <Shield className="h-3 w-3" />
                  {user.role}
                </Badge>
                <Badge
                  variant={
                    user.isActive === "ACTIVE" ? "default" : "destructive"
                  }
                  className="px-3 py-1"
                >
                  {user.isActive}
                </Badge>
                {isGoogleUser && (
                  <Badge
                    variant="outline"
                    className="text-blue-600 border-blue-600 px-3 py-1"
                  >
                    Google Account
                  </Badge>
                )}
                {user.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600 px-3 py-1"
                  >
                    Verified
                  </Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6">
                {!isEditingProfile ? (
                  <Button
                    type="button"
                    onClick={() => {
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-2 px-6 py-2"
                  >
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      disabled={
                        !profileForm.formState.isDirty ||
                        profileForm.formState.isSubmitting
                      }
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <Save className="h-4 w-4" /> Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        profileForm.reset();
                      }}
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Key className="h-6 w-6 text-primary" />
              </div>
              Password Settings
            </CardTitle>
            <CardDescription className="text-base">
              {hasPassword
                ? "Update your existing password"
                : "Set a password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasPassword ? (
              // Reset password form for users who already have a password
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      {...passwordForm.register("oldPassword")}
                      disabled={!isEditingPassword}
                      className={
                        !isEditingPassword
                          ? "bg-muted/50 pr-10"
                          : "pr-10 focus:ring-2 focus:ring-primary/20"
                      }
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword((s) => !s)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.oldPassword && (
                    <p className="text-sm text-red-500">
                      {passwordForm.formState.errors.oldPassword.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="newPassword"
                      className="text-sm font-medium"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...passwordForm.register("newPassword")}
                        disabled={!isEditingPassword}
                        className={
                          !isEditingPassword
                            ? "bg-muted/50 pr-10"
                            : "pr-10 focus:ring-2 focus:ring-primary/20"
                        }
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword((s) => !s)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...passwordForm.register("confirmPassword")}
                        disabled={!isEditingPassword}
                        className={
                          !isEditingPassword
                            ? "bg-muted/50 pr-10"
                            : "pr-10 focus:ring-2 focus:ring-primary/20"
                        }
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  {!isEditingPassword ? (
                    <Button
                      type="button"
                      onClick={() => setIsEditingPassword(true)}
                      className="flex items-center gap-2 px-6 py-2"
                    >
                      <Edit3 className="h-4 w-4" />
                      Change Password
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2"
                      >
                        <Save className="h-4 w-4" />
                        Update Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditingPassword(false);
                          passwordForm.reset();
                          setShowCurrentPassword(false);
                          setShowNewPassword(false);
                          setShowConfirmPassword(false);
                        }}
                        className="flex items-center gap-2 px-6 py-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </form>
            ) : (
              // Set password form for users without password
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="setPassword"
                      className="text-sm font-medium"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="setPassword"
                        type={showSetPassword ? "text" : "password"}
                        {...setPasswordForm.register("password")}
                        disabled={!isEditingPassword}
                        className={
                          !isEditingPassword
                            ? "bg-muted/50 pr-10"
                            : "pr-10 focus:ring-2 focus:ring-primary/20"
                        }
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowSetPassword((s) => !s)}
                      >
                        {showSetPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {setPasswordForm.formState.errors.password && (
                      <p className="text-sm text-red-500">
                        {setPasswordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="setConfirmPassword"
                      className="text-sm font-medium"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="setConfirmPassword"
                        type={showSetConfirmPassword ? "text" : "password"}
                        {...setPasswordForm.register("confirmPassword")}
                        disabled={!isEditingPassword}
                        className={
                          !isEditingPassword
                            ? "bg-muted/50 pr-10"
                            : "pr-10 focus:ring-2 focus:ring-primary/20"
                        }
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowSetConfirmPassword((s) => !s)}
                      >
                        {showSetConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {setPasswordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {
                          setPasswordForm.formState.errors.confirmPassword
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  {!isEditingPassword ? (
                    <Button
                      type="button"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        setIsEditingPassword(true);
                      }}
                    >
                      <Edit3 className="h-4 w-4 mr-2" /> Set Password
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        onClick={() =>
                          setPasswordForm.handleSubmit(onSetPasswordSubmit)()
                        }
                      >
                        <Save className="h-4 w-4 mr-2" /> Set Password
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordForm.reset();
                          setShowSetPassword(false);
                          setShowSetConfirmPassword(false);
                        }}
                      >
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                    </>
                  )}
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              Account Information
            </CardTitle>
            <CardDescription className="text-base">
              Additional account details and authentication information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account ID
                </Label>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono text-foreground">
                    {user._id}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Authentication Provider
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {user.auths?.map((auth: any, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="px-3 py-1 capitalize"
                    >
                      {auth.provider}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Account Status
                </Label>
                <Badge
                  variant={
                    user.isActive === "ACTIVE" ? "default" : "destructive"
                  }
                  className="px-3 py-1"
                >
                  {user.isActive}
                </Badge>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Verification Status
                </Label>
                <Badge
                  variant={user.isVerified ? "default" : "secondary"}
                  className="px-3 py-1"
                >
                  {user.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
