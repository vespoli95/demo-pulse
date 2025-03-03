import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("polls", "./routes/polls.tsx"),
] satisfies RouteConfig;
