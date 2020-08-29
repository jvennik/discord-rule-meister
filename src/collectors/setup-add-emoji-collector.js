import { dbget } from "../utils/dbget";

export const setupAddEmojiCollector = async function setupAddEmojiCollector(
  msg
) {
  const sql = `
  SELECT initial_role, grant_role
  FROM settings
  WHERE guild = ?
  `;
  const settings = await dbget(sql, [msg.guild.id]);

  const filter = (reaction, user) => reaction.emoji.name === "✅";
  const collector = msg.createReactionCollector(filter, {
    time: 1000 * 60 * 30,
    dispose: true
  });

  collector.on("collect", reaction => {
    reaction.users.forEach(user => {
      if (!user.bot) {
        const member = msg.guild.member(user.id);
        if (member !== null) {
          const grantRole = msg.guild.roles.find(
            role => role.id === settings.grant_role
          );
          const removeRole = msg.guild.roles.find(
            role => role.id === settings.initial_role
          );

          member.addRole(grantRole).catch(err => {
            console.error("Failed to grant membership");
            console.error(err);
          });

          member.removeRole(removeRole).catch(err => {
            console.error("Failed to revoke initial");
            console.error(err);
          });
        }
      }
    });
  });

  collector.on("end", async () => {
    await setupAddEmojiCollector(msg);
  });
};

export default setupAddEmojiCollector;
