const dotenv = require("dotenv");
const express = require("express");
const expressJWT = require("express-jwt");
const morgan = require("morgan");
const dbDatasource = require("./db");
<%if eq (index .Params `apiType`) "graphql" %>const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");<% end %>
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");<% end %>
const statusRoutes = require("./app/status");
<%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");<% end %>
const { jwtSecret } = require("./conf");
const mockauthRoutes = require("./mockauth");
const pathToRegexp = require('path-to-regexp');

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//the middleware to verify token and parse token to req.user
app.use(expressJWT({
  secret: jwtSecret,
  algorithms: ['HS256','RS256']
  }).unless({
  path: [pathToRegexp('/mock/*'), pathToRegexp('/status/*')] 
}));
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {   
    res.status(401).json('invalid token')
  }
});

<%if eq (index .Params `apiType`) "graphql" %>
const server = new ApolloServer({
  context: async ( {req} ) => {
    if(req.user){
      return { user: {id: req.user.id, email: req.user.email} };
    }
  },
  typeDefs,
  resolvers
});
server.applyMiddleware({ app });<% end %>

<%if eq (index .Params `fileUploads`) "yes" %>app.use("/file", fileRoutes);<% end %>

<%if eq (index .Params `userAuth`) "yes" %>app.use("/auth", authRoutes);<% end %>
app.use("/mock",mockauthRoutes);

app.use("/status", statusRoutes);

var port = process.env.SERVER_PORT;
if (!port) {
  port = 3000;
}

const main = async () => {
  // remove this block for development, just for verifying DB
  try {
    await dbDatasource.authenticate();
    console.log("Connection has been established successfully.");
    await dbDatasource.sync( {alter: true} );
    console.log("Created or altered tables");
    const res = await dbDatasource.query("SELECT 1");
    console.log(`Query successful, returned ${res[0].length} rows.`);
  } catch (e) {
    console.error(e);
  }

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

main();

