export const api = {
  auth: {
    guestLogin: 'auth:guestLogin',
    login: 'auth:login',
    logout: 'auth:logout',
    register: 'auth:register',
    upgradeGuest: 'auth:upgradeGuest',
    me: 'auth:me',
  },
  profiles: {
    getMe: 'profiles:getMe',
    ensureProfile: 'profiles:ensureProfile',
    completeRegistration: 'profiles:completeRegistration',
    updateName: 'profiles:updateName',
    saveAvatar: 'profiles:saveAvatar',
  },
  services: {
    list: 'services:list',
    create: 'services:create',
    update: 'services:update',
    remove: 'services:remove',
  },
  reviews: {
    list: 'reviews:list',
    averageRating: 'reviews:averageRating',
    create: 'reviews:create',
    submit: 'reviews:submit',
    update: 'reviews:update',
    remove: 'reviews:remove',
  },
  cms: {
    listByPage: 'cms:listByPage',
    upsert: 'cms:upsert',
    remove: 'cms:remove',
  },
  theme: {
    get: 'theme:get',
    update: 'theme:update',
    reset: 'theme:reset',
  },
  navItems: {
    list: 'navItems:list',
    create: 'navItems:create',
    createCustomPage: 'navItems:createCustomPage',
    update: 'navItems:update',
    remove: 'navItems:remove',
  },
  admins: {
    isCurrentUserAdmin: 'admins:isCurrentUserAdmin',
  },
} as const
