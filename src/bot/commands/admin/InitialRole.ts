import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Role, Message } from 'discord.js';
import { INITIAL_ROLE_RESULT, setInitialRole } from '../../../utils/setInitialRole';

export default class InitialRoleCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'initial_role',
      memberName: 'initial_role',
      group: 'admin',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      description:
        'Set the initial role to be granted to new members',
      args: [
        {
          key: 'role',
          prompt: 'Provide the role you want to set as the initial_role',
          type: 'role',
        },
      ],
    });
  }

  public async run(
    msg: CommandoMessage,
    { role }: { role: Role }
  ): Promise<Message> {
    const result = await setInitialRole({ guildId: msg.guild.id, roleId: role.id});

    switch(result) {
      case INITIAL_ROLE_RESULT.FAILED:
        return msg.channel.send('Something went wrong with the command, check your input please');
      default:
        return msg.channel.send('Initial role set');
    }
  }
}
