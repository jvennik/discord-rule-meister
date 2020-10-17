import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import { checkSettings } from '../../../utils/checkSettings';

export default class CheckSettingsCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'check_settings',
      memberName: 'check_settings',
      group: 'admin',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      description: 'Check to see if all the settings are set',
    });
  }

  public async run(
    msg: CommandoMessage
  ): Promise<Message> {
    const message = await checkSettings({guild: msg.guild});
    return msg.channel.send(message);
  }
}
