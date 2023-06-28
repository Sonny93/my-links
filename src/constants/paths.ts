const PATHS = {
  LOGIN: "/login",
  LOGOUT: "/logout",
  HOME: "/",
  ADMIN: "/admin",
  CATEGORY: {
    CREATE: "/category/create",
    EDIT: "/category/edit",
    REMOVE: "/category/remove",
  },
  LINK: {
    CREATE: "/link/create",
    EDIT: "/link/edit",
    REMOVE: "/link/remove",
  },
  API: {
    CATEGORY: "/api/category",
    LINK: "/api/link",
    ADMIN: {
      USER: "/api/admin/users",
    },
  },
  NOT_FOUND: "/404",
  SERVER_ERROR: "/505",
};

export default PATHS;
