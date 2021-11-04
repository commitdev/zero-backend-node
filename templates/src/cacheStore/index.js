<%if eq (index .Params `cacheStore`) "memcached" %>	
const Memcached = require("memcached");
<% end %>
const dotenv = require("dotenv");

dotenv.config();
const {
    CACHE_ENDPOINT,
    CACHE_PORT
} = process.env;

<%if eq (index .Params `cacheStore`) "memcached" %>	
const cacheStore = new Memcached(`${CACHE_ENDPOINT}:${CACHE_PORT}`)
module.exports = cacheStore;
<% end %>

