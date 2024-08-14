import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import bannerRoutes from './banner/routes'

export default [
    ...authRoutes,
    ...userRoutes,
    ...bannerRoutes,
];
