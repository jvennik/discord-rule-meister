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

  if (settingsObj?.valid()) {
    const boundChannel = guild.channels.cache.find(
      (channel: { id: string }) => channel.id === settingsObj?.channel
    );

    const targetChannel = await boundChannel?.fetch();
    let bindMessage = null;
    await (targetChannel as TextChannel).messages.fetch().then((messages) => {
      const msgArray = messages.array();
      console.log(`Rebinding for ${guild.id}: ${guild.name}`);

      msgArray.forEach((message) => {
        if (message.content.indexOf(settingsObj.message) >= 0) {
          bindMessage = message;
        }
      });
    });

    if (bindMessage) {
      addReactionCollector(bindMessage);
    }
  }
  return true;
};

export default rebind;
