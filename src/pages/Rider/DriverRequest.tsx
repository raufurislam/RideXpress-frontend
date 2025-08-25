import { TriangleAlert } from "lucide-react";
import { useLocation } from "react-router";

export default function DriverRequest() {
  const location = useLocation();
  const basicInfo = location.state; // { name, email, password }
  console.log("Driver request", basicInfo);
  return (
    <div>
      <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
        <p className="text-sm">
          <TriangleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          You must complete the information of your to request for driver. After
          verification your role is seted to Driver. If you not provide your
          information you can serve our website to as User.
        </p>
      </div>
      <h1>This is DriverRequest component</h1>
    </div>
  );
}
