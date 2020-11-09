import { Guild, TextChannel, GuildChannel } from 'discord.js';
import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';
import { addReactionCollector } from '../utils/reactionCollector';

export const rebind = async function rebind({
  guild,
}: {
  guild: Guild;
}): Promise<boolean> {
  const settingsRepository = getRepository(Settings);

  const settingsObj = await settingsRepository.findOne({
    where: { guild: guild.id },
  });

  if (settingsObj && settingsObj.valid()) {
    const boundChannel = guild.channels.cache.find(
      (channel: { id: string }) => channel.id === settingsObj?.channel
    ) as GuildChannel;

    if (!boundChannel) {
      return false;
    }

    if (boundChannel instanceof TextChannel) {
      const targetChannel = (await boundChannel.fetch(true)) as TextChannel;

      if (!targetChannel) {
        return false;
      }

      try {
        const bindMessage = await targetChannel.messages.fetch(
          settingsObj.message_id,
          false,
          true
        );

        if (bindMessage) {
          console.log(`Rebinding for ${guild.id}: ${guild.name}`);
          addReactionCollector(bindMessage);
        }
      } catch (e) {
        console.error(e);
        console.log(
          `Could not find target channel for ${guild.id}: ${guild.name}`
        );
      }
    }
  }
  return true;
};

export default rebind;
