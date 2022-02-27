/* eslint-disable no-param-reassign */
import { Show, ShowWithoutAvailableSeatCount } from '../../../shared/types';
import { venueCapacity } from '../../db/constants';
import {
  filenames,
  getItemById,
  getJSONfromFile,
  writeJSONToFile,
} from './general';
import { getAvailableSeatCountByShowId } from './reservations';

export async function writeShows(
  newShowsArray: ShowWithoutAvailableSeatCount[],
): Promise<void> {
  await writeJSONToFile(filenames.shows, newShowsArray);
}

export async function getShows(): Promise<Show[]> {
  const showsMinusAvailableSeatCount =
    await getJSONfromFile<ShowWithoutAvailableSeatCount>(filenames.shows);
  const availableSeatCountByShowId = await getAvailableSeatCountByShowId();

  const fullDataShows = showsMinusAvailableSeatCount.map((show) => {
    const availableSeatCount =
      availableSeatCountByShowId[show.id] ?? venueCapacity;
    const fullDataShow = {
      ...show,
      availableSeatCount,
    };
    return fullDataShow;
  });

  return fullDataShows;
}

export async function getShowById(showId: number): Promise<Show> {
  const showWithoutSeatCount = await getItemById<ShowWithoutAvailableSeatCount>(
    showId,
    filenames.shows,
    'show',
  );
  const availableSeatCountByShowId = await getAvailableSeatCountByShowId();
  const availableSeatCount =
    availableSeatCountByShowId[showId] ?? venueCapacity;
  return { ...showWithoutSeatCount, availableSeatCount };
}
