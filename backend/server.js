const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("./backend/server.json");
const middlewares = jsonServer.defaults();

function isAuthorized(value) {
  if (value === "Bearer teste-token") return true;

  return false;
}

server.use(middlewares);

server.use((req, res, next) => {
  if (isAuthorized(req.headers.authorization)) {
    setTimeout(async () => {
      next();
    }, 2000);
  } else {
    res.sendStatus(401);
  }
});

server.use(router);

server.listen(3333, () => {
  console.log("JSON Server is running");
});
