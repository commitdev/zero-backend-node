const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
<%if eq (index .Params `graphql`) "yes" %>const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./app/graphql/schema");
const resolvers = require("./app/graphql/resolvers");
const ExampleAPIDataSource = require("./app/graphql/exampleapiDataSource");
const dbInitializer = require("./app/graphql/dbInitializer");
const exampleRoutes = require("./app/graphql/exampleapi");<% end %>
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");<% end %>
const statusRoutes = require("./app/status");
<%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");<% end %>

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

<%if eq (index .Params `graphql`) "yes" %>const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    ExampleapiDataSource: new ExampleAPIDataSource(),
  }),
});
server.applyMiddleware({ app });

dbInitializer.initschema();
app.use("/example", exampleRoutes);<% end %>

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
    const dbDatasource = require("./db/datasource");
    await dbDatasource.authenticate();
    console.log("Connection has been established successfully.");
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
