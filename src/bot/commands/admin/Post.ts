const { escapeMarkdown } = require('discord.js');
const { stripIndents } = require('common-tags');

import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import { postToChannel, POST_RESULT } from '../../../actions/post';

export default class PostCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'post',
      memberName: 'post',
      group: 'admin',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Post the category messages and role reactions',
    });
  }

  public onError(err: Error, message: CommandoMessage) {
    const owners = this.client.owners;
		const ownerList = owners ? owners.map((usr, i) => {
			const or = i === owners.length - 1 && owners.length > 1 ? 'or ' : '';
			return `${or}${escapeMarkdown(usr.username)}#${usr.discriminator}`;
		}).join(owners.length > 2 ? ', ' : ' ') : '';

		return message.reply(stripIndents`
      An error occurred while running the command: \`${err.name}: ${err.message}\`
      Common issues:
      - The bot does not have sufficient permissions (send messages, delete messages, grant roles)
      - Please make sure the order of the roles has the grant role listed below the role of the bot
			If checking the above did not help then please contact ${ownerList} for support.
		`);
  }

  public async run(msg: CommandoMessage): Promise<Message> {
    const result = await postToChannel({
      guildId: msg.guild.id,
      msg: msg,
    });

    switch (result) {
      case POST_RESULT.INVALID:
        return msg.channel.send('Settings are incomplete. Check the `check_settings` command.');
      case POST_RESULT.NO_CHANNEL_FOUND:
        return msg.channel.send('The bound channel can no longer be found.');
      default:
        return msg.channel.send('Posted rules');
    }
  }
}
