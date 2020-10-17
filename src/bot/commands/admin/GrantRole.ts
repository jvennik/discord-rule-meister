import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Role, Message } from 'discord.js';
import { GRANT_ROLE_RESULT, setGrantRole } from '../../../utils/setGrantRole';

export default class GrantRoleCommand extends Command {
  public constructor(client: CommandoClient) {
    super(client, {
      name: 'grant_role',
      memberName: 'grant_role',
      group: 'admin',
      guildOnly: true,
      userPermissions: ['MANAGE_MESSAGES'],
      description:
        'Set the grant role to be granted to new members',
      args: [
        {
          key: 'role',
          prompt: 'Provide the role you want to set as the grant_role',
          type: 'role',
        },
      ],
    });
  }

  public async run(
    msg: CommandoMessage,
    { role }: { role: Role }
  ): Promise<Message> {
    const result = await setGrantRole({ guildId: msg.guild.id, roleId: role.id});

    switch(result) {
      case GRANT_ROLE_RESULT.FAILED:
        return msg.channel.send('Something went wrong with the command, check your input please');
      default:
        return msg.channel.send('Grant role set');
    }
  }
}
