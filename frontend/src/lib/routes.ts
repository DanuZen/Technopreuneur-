import { UserRole } from "@/types";

export type DashboardRoleSegment = "user" | "company" | "admin";

export function isValidDashboardRole(role: string): role is DashboardRoleSegment {
  return role === "user" || role === "company" || role === "admin";
}

export function getRoleSegment(role?: UserRole | string | null): DashboardRoleSegment {
  if (role === "employer" || role === "company") return "company";
  if (role === "admin") return "admin";
  return "user";
}

export function getDashboardBasePath(role?: UserRole | string | null): string {
  return `/${getRoleSegment(role)}/dashboard`;
}

export function getRoleFromPathname(pathname: string): DashboardRoleSegment {
  const match = pathname.match(/^\/(user|company|admin)\/dashboard(\/|$)/);
  if (match && isValidDashboardRole(match[1])) {
    return match[1];
  }
  return "user";
}

