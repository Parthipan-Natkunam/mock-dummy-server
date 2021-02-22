const fastify = require("fastify")({ logger: true });
const dotenv = require("dotenv").config();
const { mockData, mockProfile } = require("./mockData");

fastify.get("/ping", async () => {
  return { data: "Server is online" };
});

fastify.post("/logout", (req, res) => {
  const { token } = req.headers;
  if (token === process.env.DEFAULT_TOKEN) {
    return { data: "success" };
  }
  return res.code(400).send();
});

fastify.get("/dashboard", (req, res) => {
  const { token } = req.headers;
  if (token === process.env.DEFAULT_TOKEN) {
    return { data: mockData };
  }
  return res
    .code(401)
    .send({ message: "Unauthorized to access this resource" });
});

fastify.get("/profile", (req, res) => {
  const { token } = req.headers;
  if (token === process.env.DEFAULT_TOKEN) {
    return { data: mockProfile };
  }
  return res
    .code(401)
    .send({ message: "Unauthorized to access this resource" });
});

fastify.post("/login", (req, res) => {
  if (!req.body || !req.body.username || !req.body.password)
    return res.code(400).send({ message: "Invalid username or password" });
  const { username, password } = req.body;
  if (
    username === process.env.DEFAULT_USERNAME &&
    password === process.env.DEFAULT_PASSWORD
  ) {
    const data = {
      username: process.env.DEFAULT_USERNAME,
      token: process.env.DEFAULT_TOKEN,
      userId: process.env.DEFAULT_UID,
    };
    return { data };
  }
  return res.code(401).send({ message: "Invalid username or password" });
});

(async () => {
  try {
    await fastify.listen(4567);
    console.log(
      "Server Running on Port 4567, available at: http://localhost:4567"
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
