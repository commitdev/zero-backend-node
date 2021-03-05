const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const dbDatasource = require("./db");
<%if eq (index .Params `fileUploads`) "yes" %>const fileRoutes = require("./app/file");<% end %>
<%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");
const { authMiddleware } = require("./middleware/auth");<% end %>
const statusRoutes = require("./app/status");

dotenv.config();
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<%if eq (index .Params `userAuth`) "yes" %>app.use(authMiddleware);
app.use("/auth", authRoutes);<% end %>

<%if eq (index .Params `fileUploads`) "yes" %>app.use("/file", fileRoutes);<% end %>

app.use("/status", statusRoutes);

const port = process.env.SERVER_PORT;
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

