module.exports = {
    apps: [
        {
            name: "quizzynov",
            cwd: "/var/www/html/QuizzYnov",
            script: "npm",
            args: "run dev",
            watch: ["frontend/src", "backend/src"],
            ignore_watch: [
                "node_modules",
                ".git",
                "frontend/dist",
                "backend/dist",
                "frontend/node_modules",
                "backend/node_modules"
            ],
            watch_delay: 1000,
            autorestart: true
        }
    ]
};
