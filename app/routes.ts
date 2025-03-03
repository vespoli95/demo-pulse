
import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  { path: "polls", element: "routes/polls.tsx" }
] satisfies RouteConfig;
