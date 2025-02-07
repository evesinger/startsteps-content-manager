import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { authorId: number; role: string };
}

export const roleMiddleware = (requiredRole?: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authorId = req.headers["x-author-id"] as string | undefined;
    const role = req.headers["x-user-role"] as string | undefined;

    console.log("🔍 Incoming Request Headers:");
    console.log("📌 x-author-id:", authorId);
    console.log("📌 x-user-role:", role);
    console.log("📌 Required Role:", requiredRole);

    if (!authorId || !role) {
      console.error("❌ Missing authentication headers");
      return res.status(401).json({ message: "Unauthorized: Missing credentials" });
    }

    if (requiredRole && role.toUpperCase() !== requiredRole.toUpperCase()) {
      console.error("❌ Access Denied: Insufficient privileges");
      return res.status(403).json({ message: "Access denied: Insufficient privileges" });
    }

    req.user = { authorId: Number(authorId), role };
    next();
  };
};
