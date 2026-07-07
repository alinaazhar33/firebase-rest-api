// services/userService.js
import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

// ✅ Get Users
export const getUsersService = async (page, limit, search) => {
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM users`;
  let countQuery = `SELECT COUNT(*) FROM users`;
  let values = [];

  if (search) {
    query += ` WHERE LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1 OR LOWER(email) LIKE $1`;
    countQuery += ` WHERE LOWER(first_name) LIKE $1 OR LOWER(last_name) LIKE $1 OR LOWER(email) LIKE $1`;
    values.push(`%${search.toLowerCase()}%`);
  }

  query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
  values.push(limit, offset);

  const users = await pool.query(query, values);

  let total;
  if (search) {
    total = await pool.query(countQuery, values.slice(0, 1));
  } else {
    total = await pool.query(countQuery);
  }

  return {
    users: users.rows,
    total: parseInt(total.rows[0].count),
  };
};

// ✅ Delete User
export const deleteUserService = async (id) => {
  await pool.query("DELETE FROM users WHERE id=$1", [id]);
};

// ✅ Login
export const loginUserService = async (email, password) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  return user;
};

// ✅ Signup
export const signupUserService = async (data) => {
  const { email, password, firstName, lastName, photoUrl } = data;

  const existing = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (existing.rows.length > 0) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await pool.query(
    `INSERT INTO users 
    (email, password_hash, first_name, last_name, photo_url, role, created_at)
    VALUES ($1,$2,$3,$4,$5,$6,NOW())
    RETURNING *`,
    [email, passwordHash, firstName, lastName, photoUrl, "user"]
  );

  return newUser.rows[0];
};

// ✅ Update User
export const updateUserService = async (data) => {
  const { email, firstName, lastName, photoUrl } = data;

  const updated = await pool.query(
    `UPDATE users
     SET first_name=$1, last_name=$2, photo_url=$3, updated_at=NOW()
     WHERE email=$4
     RETURNING *`,
    [firstName, lastName, photoUrl, email]
  );

  return updated.rows[0];
};