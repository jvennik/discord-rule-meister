import { guildCreate } from "./guildcreate";
import { guildExists } from "./guildexists";

export const guildCheck = async function guildCheck(guildId) {
  const exists = await guildExists(guildId);

  if (exists === undefined) {
    // Create guild if it does not exist yet
    console.log("Creating guild: " + msg.guild.id);
    guildCreate(msg.guild.id);
  }
};
