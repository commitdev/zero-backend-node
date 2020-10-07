install:
	npm i
	# See https://sequelize.org/master/manual/getting-started.html for supported db drivers
	<%if eq (index .Params `database`) "postgres" %>npm i --save pg pg-hstore<% else if eq (index .Params `database`) "mysql" %>npm i --save mysql2<% end %>

run:
	PORT=80 node src/app.js
