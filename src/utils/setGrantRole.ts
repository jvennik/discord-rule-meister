import { getRepository } from 'typeorm';
import { Settings } from '../entity/Settings';

export enum GRANT_ROLE_RESULT {
  SUCCESS,
  FAILED,
}

export const setGrantRole = async function setGrantRole({
  guildId,
  roleId,
}: {
  guildId: string;
  roleId: string,
}): Promise<GRANT_ROLE_RESULT> {
  try {
    const settingsRepository = getRepository(Settings);

    const settings = await settingsRepository.findOne({
      where: { guild: guildId },
    });

    if (settings) {
      settings.grant_role = roleId;
      await settingsRepository.save(settings);
      return GRANT_ROLE_RESULT.SUCCESS;
    }
    return GRANT_ROLE_RESULT.FAILED;
  } catch (e) {
    console.error(e);
    return GRANT_ROLE_RESULT.FAILED;
  }
};

export default setGrantRole;
