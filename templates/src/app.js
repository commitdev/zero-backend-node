const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const dbDatasource = require("./db");
<%if eq (index .Params `graphql`) "yes" %>const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./app/graphql/schema");
const { createStore } = require("./app/graphql/utils");
const resolvers = require("./app/graphql/resolvers");
const LaunchAPI = require("./app/graphql/datasources/LaunchAPI");
const UserDB = require("./app/graphql/datasources/UserDB");
const FileAPI = require("./app/graphql/datasources/FileAPI")
const isEmail = require('isemail');<% end %>
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");<% end %>
const statusRoutes = require("./app/status");
<%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");<% end %>

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

<%if eq (index .Params `graphql`) "yes" %>
const store = createStore();

const server = new ApolloServer({
  context: async ({ req }) => {
    // simple auth check on every request
    const auth = req.headers && req.headers.authorization || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] || null;
    return { user: { ...user.dataValues } };
  },
  typeDefs,
  resolvers,
  dataSources: () => ({
    launchAPI: new LaunchAPI(),
    userDB: new UserDB({ store }),
    fileAPI: new FileAPI()
  }),
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
