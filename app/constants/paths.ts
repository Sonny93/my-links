const PATHS = {
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',
  },
  HOME: '/',
  APP: '/app',
  SHARED: '/shared',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  ADMIN: '/admin',
  CATEGORY: {
    CREATE: '/category/create',
    EDIT: '/category/edit',
    REMOVE: '/category/remove',
  },
  LINK: {
    CREATE: '/link/create',
    EDIT: '/link/edit',
    REMOVE: '/link/remove',
  },
  API: {
    CATEGORY: '/api/category',
    LINK: '/api/link',
  },
  NOT_FOUND: '/404',
  SERVER_ERROR: '/505',
  AUTHOR: 'https://www.sonny.dev/',
  REPO_GITHUB: 'https://github.com/Sonny93/my-links',
  EXTENSION: 'https://chromewebstore.google.com/detail/mylinks/agkmlplihacolkakgeccnbhphnepphma',
} as const;

export default PATHS;
