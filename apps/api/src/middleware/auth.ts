import { Request, Response, NextFunction } from "express";
import { User, SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin, supabasePublic, createScopedSupabaseClient } from "../lib/supabase";
import { ApiError } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
  user?: User;
  token?: string;
  supabase?: SupabaseClient;
  isAdmin?: boolean;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "UNAUTHORIZED", "Missing or invalid authorization header"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ApiError(401, "UNAUTHORIZED", "Bearer token is empty"));
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return next(new ApiError(401, "UNAUTHORIZED", "Invalid or expired session"));
    }

    req.user = user;
    req.token = token;
    req.supabase = createScopedSupabaseClient(token);
    next();
  } catch (err: any) {
    next(new ApiError(401, "UNAUTHORIZED", "Failed to verify authentication token"));
  }
}

export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.supabase = supabasePublic;
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    req.supabase = supabasePublic;
    return next();
  }

  try {
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (user) {
      req.user = user;
      req.token = token;
      req.supabase = createScopedSupabaseClient(token);
    } else {
      req.supabase = supabasePublic;
    }
  } catch {
    req.supabase = supabasePublic;
  }
  next();
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    return next(new ApiError(401, "UNAUTHORIZED", "Authentication required"));
  }

  try {
    // Defense-in-depth: Re-verify role directly in database
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (error || !profile || profile.role !== "admin") {
      return next(new ApiError(403, "FORBIDDEN", "Admin privileges required"));
    }

    req.isAdmin = true;
    next();
  } catch (err: any) {
    next(new ApiError(403, "FORBIDDEN", "Failed to verify admin authorization"));
  }
}
