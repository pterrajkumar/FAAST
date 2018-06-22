const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://pwcadmin@azurepostgreappdynamics:Welcome12345@azurepostgreappdynamics.postgres.database.azure.com:5432/postgres?ssl=false';

const config = {
  host: 'azurepostgreappdynamics.postgres.database.azure.com',
  user: 'pwcadmin@azurepostgreappdynamics',
  database: 'postgres',
  password: 'Welcome12345',
  port: 5432,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};
// pool takes the object above -config- as parameter
const pool = new pg.Pool(config);

pool.connect(function (err, client, done) {
  // Handle connection errors
  if(err) {
    console.log(err);
  }
  console.log("connected");  

  client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)', function (err, result) {
        done();
        if (err) {
            console.log(err);
        }
        console.log("DB Created");
  })
});



/* const client = new pg.Client(connectionString);
client.connect();
console.log("connected");
const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); }); */