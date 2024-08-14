import { createSuperAdminUser } from "../services/auth/controller";

export const defaultCreates = async () => {
    await createSuperAdminUser();
};