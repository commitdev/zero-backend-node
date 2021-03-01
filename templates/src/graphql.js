const dotenv = require("dotenv");
const express = require("express");

const morgan = require("morgan");
const dbDatasource = require("./db");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
<%if eq (index .Params `userAuth`) "yes" %>
const mockauthRoutes = require("./mockauth");
const {jwtDecoder, unAuthErrorHandler} = require("./middleware/auth/jwtDecoder");<% end %>


dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(jwtDecoder);
app.use(unAuthErrorHandler);

const server = new ApolloServer({
  context: async ( {req} ) => {
    if(req.user){
      return { user: {id: req.user.id, email: req.user.email} };
    }
  },
  typeDefs,
  resolvers
});
server.applyMiddleware({ app });

<%if eq (index .Params `userAuth`) "yes" %>
app.use("/mock",mockauthRoutes);<% end %>

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

