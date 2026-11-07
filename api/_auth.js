export const isAdmin = (req) => !!process.env.ADMIN_CODE && req.headers["x-admin-code"] === process.env.ADMIN_CODE;
