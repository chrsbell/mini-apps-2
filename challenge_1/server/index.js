const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");

const router = jsonServer.router(path.join(__dirname, "..", "data", "db.json"));

const options = {
  static: path.join(__dirname, "..", "public"),
};

// middleware with names for readability
const middlewareArray = jsonServer.defaults(options);
let middlewares = {};
middlewareArray.forEach((middleware) => {
  middlewares[middleware.name] = middleware;
});

server.use("/", middlewares.compression);
server.use("/", middlewares.serveStatic);
server.use("/", middlewares.logger);

// use same static files on react router endpoints
server.use("/page/:id", middlewares.serveStatic);

// json server
server.use("/api", router);

server.listen(3000, () => {
  console.log(`JSON Server is running at http://localhost:3000`);
});
