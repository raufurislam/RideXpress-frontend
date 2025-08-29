import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, Mail, Phone } from "lucide-react";
import { Link, useLocation } from "react-router";

const AccountStatus = () => {
  const location = useLocation();
  const userStatus = location.state?.status || "UNKNOWN";

  const getMessage = () => {
    if (userStatus === "SUSPENDED")
      return "Your account is temporarily suspended. Please contact support to resolve the issue.";
    if (userStatus === "BLOCKED")
      return "Your account has been blocked. Contact support for assistance.";
    return "Unknown account status.";
  };

  const getIcon = () => {
    if (userStatus === "SUSPENDED" || userStatus === "BLOCKED") {
      return <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />;
    }
    return <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-md text-center shadow-lg rounded-xl p-6 bg-card">
        <CardHeader>
          {getIcon()}
          <CardTitle className="text-2xl font-bold">{`Account Status: ${userStatus}`}</CardTitle>
          <CardDescription className="mt-2">{getMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="mt-4 text-sm text-muted-foreground space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <a
              href="mailto:support@example.com"
              className="underline font-medium text-blue-600 dark:text-blue-400"
            >
              support@example.com
            </a>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="font-medium">+880 1234 567890</span>
          </div>
        </CardContent>
        <div className="mt-6">
          <Button variant="default" className="w-full">
            <Link to="/" className="w-full block">
              Go back to Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AccountStatus;

// import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { AlertTriangle, CheckCircle2, Mail, Phone } from "lucide-react";
// import { Link, useLocation } from "react-router";

// const AccountStatus = () => {
//   const { data, isLoading } = useUserInfoQuery(undefined);
//   // const userStatus = data?.data?.isActive || "UNKNOWN";
//   const location = useLocation();
//   const userStatus =
//     location.state?.status || data?.data?.isActive || "UNKNOWN";

//   const getMessage = () => {
//     if (userStatus === "SUSPENDED")
//       return "Your account is temporarily suspended. Please contact support.";
//     if (userStatus === "BLOCKED")
//       return "Your account has been blocked. Contact support for assistance.";
//     return "Unknown account status.";
//   };

//   const getIcon = () => {
//     if (userStatus === "SUSPENDED" || userStatus === "BLOCKED") {
//       return <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />;
//     }
//     return <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />;
//   };

//   if (isLoading) return null; // or a loader

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-4">
//       <Card className="w-full max-w-md text-center shadow-lg rounded-xl p-6 bg-card">
//         <CardHeader>
//           {getIcon()}
//           <CardTitle className="text-2xl font-bold">{`Account Status: ${userStatus}`}</CardTitle>
//           <CardDescription className="mt-2">{getMessage()}</CardDescription>
//         </CardHeader>
//         <CardContent className="mt-4 text-sm text-muted-foreground space-y-2">
//           <div className="flex items-center justify-center gap-2">
//             <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//             <a
//               href="mailto:support@example.com"
//               className="underline font-medium text-blue-600 dark:text-blue-400"
//             >
//               support@example.com
//             </a>
//           </div>
//           <div className="flex items-center justify-center gap-2">
//             <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
//             <span className="font-medium">+880 1234 567890</span>
//           </div>
//         </CardContent>
//         <div className="mt-6">
//           <Button variant="default" className="w-full">
//             <Link to="/" className="w-full block">
//               Go back to Home
//             </Link>
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AccountStatus;
