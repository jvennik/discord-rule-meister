import { User, Message, MessageReaction } from 'discord.js';
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
    async (reaction: MessageReaction, user: User) => {
      if (!msg.guild) {
        throw new Error('Guild missing from message');
      }

      await reaction.message.guild?.members.fetch({user: [user.id], force: true});
      const member = reaction.message.guild?.members.cache.find(member => member.id === user.id);

      if (member && member.user && member.user.bot) {
        return;
      }

      if (member) {
        member.roles.add(settings.grant_role);
        member.roles.remove(settings.initial_role);
      }
    }
  );

  collector.on(
    'remove',
    async (reaction: MessageReaction, user: User) => {
      await reaction.message.guild?.members.fetch({user: [user.id], force: true});
      const member = reaction.message.guild?.members.cache.find(member => member.id === user.id);

      if (member) {
        member.roles.add(settings.initial_role);
        member.roles.remove(settings.grant_role);
      }
    }
  );

  collector.on('end', async () => {
    await addReactionCollector(msg);
  });
};
