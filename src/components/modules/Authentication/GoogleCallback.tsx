import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const err = params.get("err"); // backend sends ?err=SUSPENDED or ?err=BLOCKED

    if (err === "SUSPENDED" || err === "BLOCKED") {
      toast.error(`Your account is ${err}`);
      navigate("/account-status", { state: { status: err } });
      return;
    }

    const token = params.get("token"); // backend sends JWT if login is successful
    if (token) {
      localStorage.setItem("token", token);
      toast.success("Logged in successfully");
      navigate("/"); // dashboard
    } else {
      toast.error("Something went wrong with Google login");
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
