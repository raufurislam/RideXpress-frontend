import mobileImg from "@/assets/images/mobile-app-location-digital-art.jpg";
import { Button } from "@/components/ui/button";
import { role } from "@/constants/role";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useNavigate } from "react-router";

export default function HeroSection() {
  const navigate = useNavigate();
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;
  const userRole = user?.role;

  const handlePrimaryAction = () => {
    if (!userRole) {
      navigate("/login");
      return;
    }
    if (userRole === role.rider) {
      navigate("/rider/request-ride");
      return;
    }
    if (userRole === role.driver) {
      navigate("/driver/get-ride");
      return;
    }
    if (userRole === role.admin || userRole === role.superAdmin) {
      navigate("/admin/analytics");
      return;
    }
  };

  const primaryCtaLabel = !userRole
    ? "Join RideExpress"
    : userRole === role.rider
    ? "Book a ride"
    : userRole === role.driver
    ? "Get rides"
    : "Go to dashboard";

  const secondaryAction = () => {
    if (!userRole) {
      navigate("/register");
      return;
    }
    if (userRole === role.rider) {
      navigate("/rider/ride-history");
      return;
    }
    if (userRole === role.driver) {
      navigate("/driver/active-ride");
      return;
    }
    if (userRole === role.admin || userRole === role.superAdmin) {
      navigate("/admin/all-rides");
      return;
    }
  };

  const secondaryCtaLabel = !userRole
    ? "Create an account"
    : userRole === role.rider
    ? "View ride history"
    : userRole === role.driver
    ? "View active rides"
    : "View all rides";

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 py-8  md:py-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-background dark:border-input">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Smarter, safer city rides</span>
              </div>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Move freely across the city with confidence
            </h1>
            <p className="text-balance text-base text-muted-foreground sm:text-lg">
              RideExpress connects riders and drivers with real-time matching,
              transparent pricing, and a delightful experience tailored for both
              light and dark mode.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button size="lg" onClick={handlePrimaryAction}>
                {primaryCtaLabel}
              </Button>
              <Button size="lg" variant="outline" onClick={secondaryAction}>
                {secondaryCtaLabel}
              </Button>
            </div>

            {!userRole && (
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            )}
          </div>

          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-tr from-primary/10 via-transparent to-transparent blur-2xl dark:from-primary/20" />
            <div className="aspect-[5/4] w-full overflow-hidden rounded-2xl border bg-muted/30 shadow-sm dark:border-input">
              <img
                src={mobileImg}
                alt="RideExpress app preview"
                className="size-full object-cover"
                loading="eager"
              />
            </div>

            <div className="pointer-events-none absolute -bottom-6 right-6 hidden rounded-xl border bg-background/70 px-4 py-3 text-sm shadow-sm backdrop-blur md:block dark:border-input">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">
                  Live drivers nearby
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
