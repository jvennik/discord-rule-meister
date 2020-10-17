import { Guild } from 'discord.js';
import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';
import createGuild from '../utils/createGuild';

export const checkSettings = async function checkSettings({
  guild,
}: {
  guild: Guild;
}): Promise<string> {
  const settingsRepository = getRepository(Settings);

  let settings = await settingsRepository.findOne({
    where: { guild: guild.id },
  });
  if (!settings) {
    settings = await createGuild({guildId: guild.id});
  }

  let valid = settings.valid();
  let message = "The following settings are set:\n";

  if (settings.channel) {
    message += `**Channel**: <#${settings.channel}> ✅\n`;
  } else {
    message += "**channel**: MISSING ❌\n";
  }

  if (settings.initial_role) {
    message += `**initial_role**: <@&${settings.initial_role}> ✅\n`;
  } else {
    message += `**initial_role**: MISSING ❌\n`;
  }

  if (settings.grant_role) {
    message += `**grant_role**: <@&${settings.grant_role}> ✅\n`;
  } else {
    message += `**grant_role**: MISSING ❌\n`;
  }

  if (settings.message) {
    message +=
      "**message**: has been set (potentially too long to display) ✅\n";
  } else {
    message += "**message**: MISSING ❌\n";
  }

  if (valid) {
    message += "**Result:** ✅"
  } else {
    message += "**Result:** ❌"
  }

  return message;
};

export default checkSettings;
