import { GuildMember, Message, MessageReaction } from 'discord.js';
// import { grantRole } from './grantRole';
// import { revokeRole } from './revokeRole';
import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export const addReactionCollector = async (msg: Message): Promise<void> => {
  if (!msg.guild) {
    throw new Error(
      'Guild missing from message when trying to mount reaction controller'
    );
  }

  const settingsRepository = getRepository(Settings);

  const settings = await settingsRepository.findOne({
    where: {
      guild: msg.guild.id,
    },
  });

  if(!settings || !settings.initial_role || !settings.grant_role) {
    return;
  }

  const filter = (reaction: MessageReaction) => reaction.emoji.name === '✅';

  const collector = msg.createReactionCollector(filter, {
    time: 1000 * 60 * 30,
    dispose: true,
  });

  collector.on(
    'collect',
    async (_, member: GuildMember) => {
      if (!msg.guild) {
        throw new Error('Guild missing from message');
      }
      const user = msg.guild.member(member.id);

      // If the reaction is from the bot, ignore it
      if (member.user && member.user.bot) {
        return;
      }

      if (user) {
        user.roles.add(settings.grant_role);
        user.roles.remove(settings.initial_role);
      }
    }
  );

  collector.on(
    'remove',
    async (_, member: GuildMember) => {
      const user = msg.guild?.member(member.id);

      if (user) {
        user.roles.add(settings.initial_role);
        user.roles.remove(settings.grant_role);
      }
    }
  );

  collector.on('end', async () => {
    await addReactionCollector(msg);
  });
};
