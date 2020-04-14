import { run } from "./dbrun";

const sql = `
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild INTEGER NOT NULL UNIQUE,
      channel TEXT NULL,
      message TEXT NULL,
      initial_role NULL,
      grant_role NULL
    )
    `;

export const DBCreate = async function createdb() {
  run(sql);
};

export default DBCreate;
