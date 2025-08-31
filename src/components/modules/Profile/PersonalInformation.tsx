import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  useUserInfoQuery,
  useUpdateUserMutation,
  useResetPasswordMutation,
  useSetPasswordMutation,
} from "@/redux/features/auth/auth.api";
import { Camera, Eye, EyeOff, Loader2, Save, Key } from "lucide-react";
import type { IAuthProvider, IUser } from "@/types";

// Form validation schemas
const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const setPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
type SetPasswordFormData = z.infer<typeof setPasswordSchema>;

export default function PersonalInformation() {
  const { toast } = useToast();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [showSetConfirmPassword, setShowSetConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // API hooks
  const { data: userResponse, isLoading: isLoadingUser } = useUserInfoQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();
  const [setPassword, { isLoading: isSettingPassword }] =
    useSetPasswordMutation();

  const user: IUser | undefined = userResponse?.data;
  const isGoogleUser = user?.auths?.some(
    (auth: IAuthProvider) => auth.provider === "google"
  );

  // Personal Info Form
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Change Password Form
  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Set Password Form
  const setPasswordForm = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      personalInfoForm.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      if (user.picture) {
        setImagePreview(user.picture);
      }
    }
  }, [user, personalInfoForm]);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle personal info update
  const onPersonalInfoSubmit = async (data: PersonalInfoFormData) => {
    if (!user?._id) return;

    try {
      const updateData: Partial<IUser> = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
      };

      // If there's a new image, convert to base64 and add to update
      if (selectedImage) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64Image = e.target?.result as string;
          await updateUser({
            userId: user._id,
            payload: { ...updateData, picture: base64Image },
          }).unwrap();

          toast({
            title: "Success",
            description: "Personal information updated successfully!",
          });
          setIsEditing(false);
          setSelectedImage(null);
        };
        reader.readAsDataURL(selectedImage);
      } else {
        await updateUser({
          userId: user._id,
          payload: updateData,
        }).unwrap();

        toast({
          title: "Success",
          description: "Personal information updated successfully!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal information. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  // Handle password change for credential users
  const onChangePasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await resetPassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast({
        title: "Success",
        description: "Password changed successfully!",
      });

      changePasswordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to change password. Please check your old password.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  // Handle password setting for Google users
  const onSetPasswordSubmit = async (data: SetPasswordFormData) => {
    try {
      await setPassword({
        password: data.password,
      }).unwrap();

      toast({
        title: "Success",
        description: "Password set successfully!",
      });

      setPasswordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set password. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading profile information...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">User information not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Upload a new profile picture
              </p>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(user.picture || "");
                  }}
                  disabled={!selectedImage}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Information</CardTitle>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            disabled={isUpdating}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...personalInfoForm.register("name")}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
                {personalInfoForm.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {personalInfoForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...personalInfoForm.register("email")}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
                {personalInfoForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {personalInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...personalInfoForm.register("phone")}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                />
                {personalInfoForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {personalInfoForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...personalInfoForm.register("address")}
                  disabled={!isEditing}
                  placeholder="Enter your address"
                />
                {personalInfoForm.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {personalInfoForm.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Password Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isGoogleUser ? (
            // Google user - can set password
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You signed up with Google. You can set a password to enable
                credential-based login.
              </p>

              <form
                onSubmit={setPasswordForm.handleSubmit(onSetPasswordSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="setPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="setPassword"
                        type={showSetPassword ? "text" : "password"}
                        {...setPasswordForm.register("password")}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSetPassword(!showSetPassword)}
                      >
                        {showSetPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {setPasswordForm.formState.errors.password && (
                      <p className="text-sm text-destructive">
                        {setPasswordForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setConfirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="setConfirmPassword"
                        type={showSetConfirmPassword ? "text" : "password"}
                        {...setPasswordForm.register("confirmPassword")}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowSetConfirmPassword(!showSetConfirmPassword)
                        }
                      >
                        {showSetConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {setPasswordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {
                          setPasswordForm.formState.errors.confirmPassword
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSettingPassword}>
                    {isSettingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Setting Password...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Set Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            // Credential user - can change password
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Change your password to keep your account secure.
              </p>

              <form
                onSubmit={changePasswordForm.handleSubmit(
                  onChangePasswordSubmit
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? "text" : "password"}
                        {...changePasswordForm.register("oldPassword")}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        {showOldPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {changePasswordForm.formState.errors.oldPassword && (
                      <p className="text-sm text-destructive">
                        {
                          changePasswordForm.formState.errors.oldPassword
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        {...changePasswordForm.register("newPassword")}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {changePasswordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {
                          changePasswordForm.formState.errors.newPassword
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...changePasswordForm.register("confirmPassword")}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {changePasswordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {
                          changePasswordForm.formState.errors.confirmPassword
                            .message
                        }
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isResettingPassword}>
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
