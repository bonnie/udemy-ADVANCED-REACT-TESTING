import { Band } from '../../../shared/types';
import {
  filenames,
  getItemById,
  getJSONfromFile,
  writeJSONToFile,
} from './general';

export async function writeBands(newBandsArray: Band[]): Promise<void> {
  await writeJSONToFile(filenames.bands, newBandsArray);
}

export async function getBands(): Promise<Band[]> {
  return getJSONfromFile<Band>(filenames.bands);
}

export async function getBandById(bandId: number): Promise<Band> {
  return getItemById<Band>(bandId, filenames.bands, 'band');
}
