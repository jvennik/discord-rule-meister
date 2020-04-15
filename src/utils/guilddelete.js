import { run } from "./dbrun";

const sql = `
DELETE FROM settings WHERE guild = ?
`;

export const guildDelete = async function guildDelete(guildId) {
  run(sql, [guildId], (err, row) => {
    if (err) {
      return console.error(err.message);
    }
  });
};

export default guildDelete;
