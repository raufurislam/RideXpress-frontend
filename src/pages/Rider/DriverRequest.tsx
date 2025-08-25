import { useLocation } from "react-router";

export default function DriverRequest() {
  const location = useLocation();
  const basicInfo = location.state; // { name, email, password }
  console.log("Driver request", basicInfo);
  return (
    <div>
      <h1>This is DriverRequest component</h1>
    </div>
  );
}
