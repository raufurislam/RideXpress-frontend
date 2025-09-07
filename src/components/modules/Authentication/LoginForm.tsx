/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { Input } from "@/components/ui/input";
import Password from "@/components/ui/Password";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import type { ILogin } from "@/types";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { Bike } from "lucide-react";
import { FaRegUserCircle } from "react-icons/fa";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm<ILogin>();
  const [login] = useLoginMutation();

  // const onSubmit = async (data: ILogin) => {
  //   try {
  //     const res = await login(data).unwrap();
  //     console.log(res);

  //     if (res.success) {
  //       toast.success("Logged in successfully");
  //       navigate("/"); // normal dashboard
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (err: any) {
  //     console.error(err);

  //     // Check the backend message for suspended/blocked users
  //     const msg = err?.data?.message || "";

  //     if (msg.includes("SUSPENDED") || msg.includes("BLOCKED")) {
  //       toast.error(`Your account is ${msg.replace("User is ", "")}`);
  //       return navigate("/account-status", {
  //         state: { status: msg.replace("User is ", "") },
  //       });
  //     }

  //     if (msg === "Password does not match") {
  //       toast.error("Invalid credential");
  //     } else if (msg === "User is not verified") {
  //       toast.error("Your account is not verified");
  //       navigate("/verify", { state: data.email });
  //     }
  //   }
  // };

  const onSubmit = async (data: ILogin) => {
    try {
      const res = await login(data).unwrap();
      console.log(res);

      if (res.success) {
        toast.success("Logged in successfully");
        navigate("/"); // normal dashboard
      }
    } catch (err: any) {
      console.error(err);

      // Check the backend message for suspended/blocked users
      const msg = err?.data?.message || "";

      if (msg.includes("SUSPENDED") || msg.includes("BLOCKED")) {
        toast.error(`Your account is ${msg.replace("User is ", "")}`);
        return navigate("/account-status", {
          state: { status: msg.replace("User is ", "") },
        });
      }

      if (msg === "Password does not match") {
        toast.error("Invalid credential");
      } else if (msg === "User is not verified") {
        toast.error("Your account is not verified");
        navigate("/verify", { state: data.email });
      } else {
        // ✅ fallback toast for any unhandled error
        toast.error(msg || "Something went wrong. Please try again.");
      }
    }
  };

  const handleDemoLogin = async (
    role: "super" | "admin" | "rider" | "driver"
  ) => {
    let credentials: ILogin;

    switch (role) {
      case "super":
        credentials = { email: "super@gmail.com", password: "753951Bd@" };
        break;
      case "admin":
        credentials = { email: "admin1@gmail.com", password: "753951Bd@" };
        break;
      case "rider":
        credentials = { email: "rider1@gmail.com", password: "753951Bd@" };
        break;
      case "driver":
        credentials = { email: "driver1@gmail.com", password: "753951Bd@" };
        break;
      default:
        return;
    }

    // call your existing login mutation
    await onSubmit(credentials);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Password
                      {...field}
                      placeholder="********"
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter you password to login.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        {/* http://localhost:5000/api/v1/auth/google */}

        <Button
          onClick={() =>
            // (window.location.href = `${config.baseUrl}/auth/google`)
            (window.location.href = `${config.baseUrl}/auth/google?redirect_uri=${config.frontendUrl}/google-callback`)
          }
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
        >
          <FcGoogle />
          Login with Google
        </Button>
      </div>

      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Or continue with Demo Credentials
        </span>
      </div>

      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => handleDemoLogin("super")}
        >
          <MdAdminPanelSettings />
          Login with Super Admin
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer mt-2"
          onClick={() => handleDemoLogin("admin")}
        >
          <MdOutlineAdminPanelSettings />
          Login with Admin
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer mt-2"
          onClick={() => handleDemoLogin("rider")}
        >
          <FaRegUserCircle />
          Login with Rider
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer mt-2"
          onClick={() => handleDemoLogin("driver")}
        >
          <Bike />
          Login with Driver
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
}
