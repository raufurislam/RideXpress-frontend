import { Link } from "react-router";

export default function Unauthorized() {
  return (
    <div>
      <h1>This is Unauthorized component</h1>
      <Link to="/">Home</Link>
    </div>
  );
}
