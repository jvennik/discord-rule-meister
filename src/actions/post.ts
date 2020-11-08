import createGuild from '../utils/createGuild';
import { CommandoMessage } from 'discord.js-commando';
import { TextChannel } from 'discord.js';
import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';
import { addReactionCollector } from '../utils/reactionCollector';

export enum POST_RESULT {
  SUCCESS,
  INVALID,
  NO_CHANNEL_FOUND,
}

export const postToChannel = async ({
  guildId,
  msg,
}: {
  guildId: string;
  msg: CommandoMessage;
}): Promise<POST_RESULT> => {
  await createGuild({ guildId });
  const settingsRepository = getRepository(Settings);

  const settings = await settingsRepository.findOne({
    where: {
      guild: guildId,
    },
  });

  if (!settings || !settings.valid()) {
    return POST_RESULT.INVALID;
  }

  const boundChannel = msg.guild.channels.cache.find(
    (channel: { id: string }) => channel.id === settings.channel
  );

  if (!boundChannel) {
    return POST_RESULT.NO_CHANNEL_FOUND;
  }
  const targetChannel = await boundChannel.fetch();

  // Purge channel first
  await (targetChannel as TextChannel).messages.fetch().then((messages) => {
    const msgArray = messages.array();

    msgArray.forEach((message) => {
      try {
        message.delete();
      } catch (e) {
        // Could not delete a message, possible 404
      }
    });
  });

  const rulesMessage = await (targetChannel as TextChannel).send(
    settings.message
  );

  await rulesMessage.react('✅');
  await addReactionCollector(rulesMessage);

  settings.message_id = rulesMessage.id;
  await settingsRepository.save(settings);

  return POST_RESULT.SUCCESS;
};
