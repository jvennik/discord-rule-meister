import { GuildMember } from 'discord.js';

export const grantRole = async function grantRole({
  member,
  role,
}: {
  member: GuildMember;
  role: string;
}): Promise<boolean> {
  try {
    member.roles.add(role);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export default grantRole;
