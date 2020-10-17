import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export enum INITIAL_ROLE_RESULT {
  SUCCESS,
  FAILED,
}

export const setInitialRole = async function setInitialRole({
  guildId,
  roleId,
}: {
  guildId: string;
  roleId: string,
}): Promise<INITIAL_ROLE_RESULT> {
  try {
    const settingsRepository = getRepository(Settings);

    const settings = await settingsRepository.findOne({
      where: { guild: guildId },
    });

    if (settings) {
      settings.initial_role = roleId;
      await settingsRepository.save(settings);
      return INITIAL_ROLE_RESULT.SUCCESS;
    }
    return INITIAL_ROLE_RESULT.FAILED;
  } catch (e) {
    console.error(e);
    return INITIAL_ROLE_RESULT.FAILED;
  }
};

export default setInitialRole;
