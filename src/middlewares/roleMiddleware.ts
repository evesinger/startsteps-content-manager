import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { authorId: number; role: string };
}

export const roleMiddleware = (allowedRoles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authorId = req.headers["x-author-id"] as string | undefined;
    const role = req.headers["x-user-role"] as string | undefined;

    console.log("Incoming Headers:", req.headers);
    console.log("Extracted - x-author-id:", authorId);
    console.log("Extracted - x-user-role:", role);
    console.log("Required Roles:", allowedRoles.length ? allowedRoles : "ANY");

    if (!authorId || !role) {
      console.error("Missing authentication headers");
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing credentials" });
    }

    //   Store user information on the request
    req.user = { authorId: Number(authorId), role: role.toUpperCase() };

    //   Roles are properly checked
    if (
      allowedRoles.length > 0 &&
      !allowedRoles.map((r) => r.toUpperCase()).includes(req.user.role)
    ) {
      console.error(
        `Access Denied: '${req.user.role}' is not in '${allowedRoles.join(", ")}'`,
      );
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient privileges" });
    }

    next();
  };
};
