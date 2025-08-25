import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px] shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <ShieldAlert className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Unauthorized Access
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            You don’t have permission to view this page.
          </p>
          <Button asChild className="w-full">
            <Link to="/">Go Back Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
