var dotenv = require("dotenv");
var express = require("express");
var morgan = require("morgan");

var { connect } = require("./db");
const statusRoutes = require("./app/status");
<%if eq (index .Params `fileUploads`) "yes" %>const fileUploadRoutes = require("./app/fileupload");
<% end %><%if eq (index .Params `userAuth`) "yes" %>const authRoutes = require("./app/auth");
<% end %>
dotenv.config();
var app = express();
app.use(morgan("combined"));

app.use("/status", statusRoutes);
<%if eq (index .Params `userAuth`) "yes" %>app.use("/", authRoutes);
<% end %><%if eq (index .Params `fileUploads`) "yes" %>app.use("/", fileUploadRoutes);
<% end %>
var port = process.env.SERVER_PORT;
if (!port) {
  port = 3000;
}

async function main() {
  const database = await connect();

  // remove this block for development, just for verifying DB
  try {
    const res = await database.query("SELECT 1");
    console.log(`Query successful, returned ${res[0].length} rows.`);
  } catch (e) {
    console.error(e);
  }

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
}

main();
