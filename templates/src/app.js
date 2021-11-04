const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const dbDatasource = require("./db");
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");
<%- end %>
<%- if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");
const { authMiddleware } = require("./middleware/auth");
<%- end %>
<%- if eq (index .Params `billingEnabled`) "yes" %>const billingRoutes = require("./app/billing");
<%- end %>
<%if eq (index .Params `cacheStore`) "memcached" %>const cacheStore = require('./cacheStore');
<%- end %>
const publicRoutes = require("./app/public");

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// these are placed before the auth middleware, so will not 401 upon non-authenticated requests
app.use("/", publicRoutes);

<% if eq (index .Params `userAuth`) "yes" %>app.use(authMiddleware);
app.use("/auth", authRoutes);<% end %>
<% if eq (index .Params `fileUploads`) "yes" %>app.use("/file", fileRoutes);<% end %>
<% if eq (index .Params `billingEnabled`) "yes" %>app.use("/billing", billingRoutes);<% end %>

const port = process.env.SERVER_PORT || 8080;

<%if eq (index .Params `cacheStore`) "memcached" %>
function touchMemcache() {
  var memcached = cacheStore;
  memcached.set('foo', 'bar', 10, function (err) {if (err) throw new Error(err); console.log("Set operation successful")});
  memcached.get('foo', function (err, data) {if (err) throw new Error(err); console.log(`Get operation successful, key: ${data}`)});
};
touchMemcache();
<% end %>

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

