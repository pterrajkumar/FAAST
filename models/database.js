const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://pwcadmin@azurepostgreappdynamics:Welcome12345@azurepostgreappdynamics.postgres.database.azure.com:5432/todo?ssl=false';

const client = new pg.Client(connectionString);
client.connect();
console.log("connected");
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });