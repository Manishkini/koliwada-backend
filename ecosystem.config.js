module.exports = {
  apps: [
    {
      name: 'koliwada-backend-cluster',
      script: 'dist/main.js',
      instances: '1',
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: {
        MONGODB_URL: process.env.MONGODB_URL,
        JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
        JWT_SECRET_USER: process.env.JWT_SECRET_USER,
        FRONTEND_URL: process.env.FRONTEND_URL,
      },
    },
  ],
};
