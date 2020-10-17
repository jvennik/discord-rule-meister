import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export const getInitialRole = async function getInitialRole({
  guildId,
}: {
  guildId: string;
}): Promise<string | undefined> {
  try {
    const settingsRepository = getRepository(Settings);

    const settingsObj = await settingsRepository.findOne({
      where: { guild: guildId },
    });

    return settingsObj?.initial_role;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export default getInitialRole;
