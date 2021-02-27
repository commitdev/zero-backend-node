const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const dbDatasource = require("./db");
<%if eq (index .Params `apiType`) "graphql" %>const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const { createStore } = require("./graphql/initdb");
const resolvers = require("./graphql/resolvers");
const LaunchAPI = require("./graphql/datasources/LaunchAPI");
const AuthAPI = require("./graphql/datasources/AuthAPI");<% end %>
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");<% end %>
const statusRoutes = require("./app/status");
<%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");<% end %>

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

<%if eq (index .Params `apiType`) "graphql" %>
const server = new ApolloServer({
  context: async ( {req} ) => {
    if(req.headers["x-user-id"] && req.headers["x-user-email"])
    return { auth: {id: req.headers["x-user-id"], email: req.headers["x-user-email"]} };
  },
  typeDefs,
  resolvers
});
server.applyMiddleware({ app });<% end %>

<%if eq (index .Params `fileUploads`) "yes" %>app.use("/file", fileRoutes);<% end %>

<%if eq (index .Params `userAuth`) "yes" %>app.use("/auth", authRoutes);<% end %>

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
    console.log("Create or alter tables");
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

