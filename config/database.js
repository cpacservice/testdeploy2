module.exports = {
  port: process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  socket: {
    url: process.env.SOCKET_URL,
    user: process.env.SOCKET_USER,
    pass: process.env.SOCKET_PASSWORD,
  },
};
