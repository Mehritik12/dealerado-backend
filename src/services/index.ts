import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import bannerRoutes from './banner/routes'
import commonRoutes from './common/routes';
import services from './services/routes'

export default [
    ...authRoutes,
    ...userRoutes,
    ...bannerRoutes,
    ...commonRoutes,
    ...services
];
