import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  user: "myadmin",
  host: "localhost",
  database: "mydb",
  password: "123456",
  port: 5432,
});