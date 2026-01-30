module.exports = {
    apps: [
        {
            name: 'tabakh-backend',
            script: './server.js',
            cwd: '/var/www/tabakhdziri/food-delivery-backend',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 5000
            },
            error_file: '/var/log/pm2/tabakh-backend-error.log',
            out_file: '/var/log/pm2/tabakh-backend-out.log',
            log_file: '/var/log/pm2/tabakh-backend-combined.log',
            time: true
        },
        {
            name: 'tabakh-frontend',
            script: 'npm',
            args: 'start',
            cwd: '/var/www/tabakhdziri/food-delivery-app',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            error_file: '/var/log/pm2/tabakh-frontend-error.log',
            out_file: '/var/log/pm2/tabakh-frontend-out.log',
            log_file: '/var/log/pm2/tabakh-frontend-combined.log',
            time: true
        }
    ]
};
