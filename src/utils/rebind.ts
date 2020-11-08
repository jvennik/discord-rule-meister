import { Guild, TextChannel } from 'discord.js';
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
    );

    if (!boundChannel) {
      return false;
    }

    const targetChannel = await boundChannel.fetch();

    if (!targetChannel) {
      return false;
    }

    let bindMessage = null;
    try {
      await (targetChannel as TextChannel).messages.fetch().then((messages) => {
        const msgArray = messages.array();
        console.log(`Rebinding for ${guild.id}: ${guild.name}`);

        msgArray.forEach((message) => {
          if (message.content.indexOf(settingsObj.message) >= 0) {
            bindMessage = message;
          }
        });
      });
    } catch (e) {
      console.log(
        'Could not find target channel for ${guild.id}: ${guild.name}'
      );
    }

    if (bindMessage) {
      addReactionCollector(bindMessage);
    } else {
      console.log(`Could not find bindMessage for ${guild.id}: ${guild.name}`);
    }
  }
  return true;
};

export default rebind;
