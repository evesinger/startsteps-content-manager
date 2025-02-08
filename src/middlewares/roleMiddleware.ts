import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { authorId: number; role: string };
}

export const roleMiddleware = (requiredRoles?: string | string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log("Incoming Headers:", req.headers);

    const authorId = req.headers["x-author-id"]?.toString();
    const role = req.headers["x-user-role"]?.toString();

    console.log("Extracted - x-author-id:", authorId);
    console.log("Extracted - x-user-role:", role);
    console.log("Required Roles:", requiredRoles);

    if (!authorId || !role) {
      console.error("Missing authentication headers");
      return res.status(401).json({ message: "Unauthorized: Missing credentials" });
    }

    // Check if requiredRoles is an array or a single string (or empty)
    if (Array.isArray(requiredRoles)) {
      if (!requiredRoles.includes(role.toUpperCase())) {
        console.error("Access Denied: Insufficient privileges");
        return res.status(403).json({ message: "Access denied: Insufficient privileges" });
      }
    } else if (requiredRoles && role.toUpperCase() !== requiredRoles.toUpperCase()) {
      console.error("Access Denied: Insufficient privileges");
      return res.status(403).json({ message: "Access denied: Insufficient privileges" });
    }

    req.user = { authorId: Number(authorId), role };
    next();
  };
};

