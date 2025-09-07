import { Button } from "@/components/ui/button";
import mobileImg from "@/assets/images/mobile-app-location-digital-art.jpg";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { role as ROLE } from "@/constants/role";
import { adminSidebarItems } from "@/routes/AdminSidebarItems";

export default function AppPromo() {
  const { data } = useUserInfoQuery(undefined);
  const user = data?.data;
  const userRole = user?.role;

  const getAdminPrimaryItem = () => {
    const dashboard = adminSidebarItems?.[0];
    const firstItem = dashboard?.items?.[0];
    return firstItem || null;
  };

  const renderCTA = () => {
    if (!user?.email) {
      return (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href="/rider/request-ride">Request a ride</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href="/login">Sign in</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.rider) {
      return (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href="/rider/request-ride">Request a ride</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href="/rider">Rider dashboard</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.driver) {
      return (
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <a href="/driver/get-ride">Get rides</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href="/driver">Driver dashboard</a>
          </Button>
        </div>
      );
    }

    if (userRole === ROLE.admin || userRole === ROLE.superAdmin) {
      const primary = getAdminPrimaryItem();
      return (
        <div className="mt-6 flex flex-wrap gap-3">
          {primary ? (
            <Button asChild size="lg" className="rounded-full">
              <a href={primary.url}>{primary.title}</a>
            </Button>
          ) : null}
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <a href="/admin/analytics">Admin dashboard</a>
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground bg-background">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            <span>Start in your browser</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mt-3">
            Book rides effortlessly online
          </h2>
          <p className="mt-3 text-muted-foreground max-w-prose">
            Plan trips, confirm fares, and track your ride from the web. No app
            needed.
          </p>
          {renderCTA()}
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <li className="text-muted-foreground">• One-tap web booking</li>
            <li className="text-muted-foreground">• Live driver tracking</li>
            <li className="text-muted-foreground">• Transparent pricing</li>
            <li className="text-muted-foreground">• 24/7 support</li>
          </ul>
        </div>
        <div className="relative">
          <img
            src={mobileImg}
            alt="Ride booking preview"
            className="rounded-xl shadow-xl w-full object-cover"
          />
          <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-md">
            Fast & Secure
          </div>
        </div>
      </div>
    </section>
  );
}
