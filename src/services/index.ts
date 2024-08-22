import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import bannerRoutes from './banner/routes'
import commonRoutes from './common/routes';

export default [
    ...authRoutes,
    ...userRoutes,
    ...bannerRoutes,
    ...commonRoutes
];
