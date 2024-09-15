module.exports = {
  apps: [
    {
      name: "playground-frontend",
      script: "npm run start:prod",
      port: 3006,
      time: true,
    },
  ],
  deploy: {
    production: {
      user: "dev",
      host: "161.97.65.149",
      key: "radovanrasha.pem",
      ref: "origin/master",
      repo: "git@github.com:radovanrasha/playground.git",
      path: "/home/dev/playground/playground-front",
      env: {
        NODE_ENV: "production",
      },
      "post-deploy":
        "rm -rf node_modules && . ~/.nvm/nvm.sh && nvm use 20 && npm install && npm run build && pm2 startOrRestart ecosystem.config.js --env production",
    },
  },
};
