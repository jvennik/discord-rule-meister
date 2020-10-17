import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import { MESSAGE_RESULT, setMessage } from '../../../utils/setMessage';

export default class MessageCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'message',
      memberName: 'message',
      group: 'admin',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      description:
        'Set the message to be posted to the rules channel',
      args: [
        {
          key: 'message',
          prompt: 'Provide the message to be posted to the rules channel',
          type: 'string',
        },
      ],
    });
  }

  public async run(
    msg: CommandoMessage,
    { message }: { message: string }
  ): Promise<Message> {
    const result = await setMessage({ guildId: msg.guild.id, message});

    switch(result) {
      case MESSAGE_RESULT.FAILED:
        return msg.channel.send('Something went wrong with the command, check your input please');
      default:
        return msg.channel.send('Message set');
    }
  }
}
