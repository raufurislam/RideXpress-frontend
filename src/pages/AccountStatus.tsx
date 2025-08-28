import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useLogoutMutation } from "@/redux/features/auth/auth.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Shield, UserX, Mail } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";

const AccountStatus = () => {
  const { data: userData, isLoading } = useUserInfoQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const user = userData?.data;
  const isBlocked = user?.isActive === "BLOCKED";
  const isSuspended = user?.isActive === "SUSPENDED";

  useEffect(() => {
    // If user is active, redirect them away from this page
    if (user && user.isActive === "ACTIVE") {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const getStatusIcon = () => {
    if (isBlocked) return <UserX className="h-16 w-16 text-red-500" />;
    if (isSuspended) return <Shield className="h-16 w-16 text-yellow-500" />;
    return <AlertCircle className="h-16 w-16 text-blue-500" />;
  };

  const getStatusTitle = () => {
    if (isBlocked) return "Account Blocked";
    if (isSuspended) return "Account Suspended";
    return "Account Status Issue";
  };

  const getStatusDescription = () => {
    if (isBlocked) {
      return "Your account has been blocked due to a violation of our terms of service. Please contact our support team to resolve this issue.";
    }
    if (isSuspended) {
      return "Your account has been temporarily suspended. This may be due to pending verification or other administrative actions.";
    }
    return "There is an issue with your account status. Please contact our support team for assistance.";
  };

  const getActionItems = () => {
    if (isBlocked) {
      return [
        "Review our terms of service and community guidelines",
        "Contact support to understand the reason for blocking",
        "Provide any requested documentation or clarification",
        "Wait for support team review and decision",
      ];
    }
    if (isSuspended) {
      return [
        "Check your email for verification requests",
        "Complete any pending profile verification steps",
        "Contact support if you believe this is an error",
        "Wait for account review completion",
      ];
    }
    return [
      "Contact our support team for assistance",
      "Provide your account details and issue description",
      "Follow support team instructions",
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {getStatusTitle()}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
            {getStatusDescription()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Account Information
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p>
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isBlocked
                      ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      : isSuspended
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {user.isActive}
                </span>
              </p>
            </div>
          </div>

          {/* Action Items */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              What you can do:
            </h3>
            <ul className="space-y-2">
              {getActionItems().map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <p>
                <span className="font-medium">Email:</span>{" "}
                support@rideexpress.com
              </p>
              <p>
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </p>
              <p>
                <span className="font-medium">Response Time:</span> Within 24-48
                hours
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleLogout} variant="outline" className="flex-1">
              Logout
            </Button>
            <Button
              onClick={() =>
                window.open("mailto:support@rideexpress.com", "_blank")
              }
              className="flex-1"
            >
              Contact Support
            </Button>
          </div>

          {/* Additional Help */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Need immediate assistance? Check our{" "}
              <button
                onClick={() => navigate("/faq")}
                className="text-primary hover:underline font-medium"
              >
                FAQ page
              </button>{" "}
              for common solutions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountStatus;
