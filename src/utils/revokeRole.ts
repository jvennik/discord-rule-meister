import { GuildMember } from 'discord.js';

export const revokeRole = async function revokeRole({
  member,
  role,
}: {
  member: GuildMember;
  role: string;
}): Promise<boolean> {
  try {
    member.roles.remove(role);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default revokeRole;
