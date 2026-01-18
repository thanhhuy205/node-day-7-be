const pool = require("../config/database");
const ApiError = require("../errors/apiError");

class AuthModel {
  async findByEmailWithPassword(email) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, email, password
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [email],
      );
      return rows[0] || null;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async createUser({ email, password }) {
    try {
      const [result] = await pool.query(
        `
        INSERT INTO users (email, password)
        VALUES (?, ?)
        `,
        [email, password],
      );

      return result.insertId;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async findById(id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id,email,verify_at
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async findByIdWithPassword(id) {
    try {
      const [rows] = await pool.query(
        `
        SELECT id, email, password
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }

  async updatePasswordById(id, password) {
    try {
      const [{ affectedRows }] = await pool.query(
        `
        UPDATE users SET password = ?
        WHERE id = ?
        LIMIT 1
        `,
        [password, id],
      );
      return affectedRows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
  async updateVerifyAtByUser(id) {
    try {
      const [{ affectedRows }] = await pool.query(
        `
        UPDATE users SET verify_at = ?
        WHERE id = ?
        LIMIT 1
        `,
        [new Date(), id],
      );
      return affectedRows;
    } catch (error) {
      throw new ApiError(500, String(error));
    }
  }
}
const authModel = new AuthModel();
module.exports = authModel;
