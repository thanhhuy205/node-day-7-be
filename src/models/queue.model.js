const { pool } = require("../config/database");

class Queue {
  async findAllPending() {
    const [rows] = await pool.query(
      `SELECT * FROM queues WHERE status = "pending";`,
    );
    return rows;
  }

  async findOnePending() {
    const [rows] = await pool.query(
      `SELECT * FROM queues WHERE status = "pending" LIMIT 1;`,
    );
    return rows[0];
  }

  async create(type, payload) {
    const [{ insertId }] = await pool.query(
      `INSERT INTO queues (type, task_name, payload) VALUES (?, ?, ?)`,
      [type, payload],
    );
    return insertId;
  }

  async updateStatus(id, status) {
    const [{ affectedRows }] = await pool.query(
      `UPDATE queues SET status = ? WHERE id = ?`,
      [status, id],
    );
    return affectedRows;
  }
}

module.exports = new Queue();
