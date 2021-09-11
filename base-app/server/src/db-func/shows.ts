/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import { Show } from '../../../shared/types';
import { ShowWithoutAvailableSeatCount } from '../../../shared/types.js';
import { venueCapacity } from '../../db/constants.js';
import {
  filenames,
  getItemById,
  getJSONfromFile,
  writeJSONToFile,
} from './general.js';
import { getAvailableSeatCountByShowId } from './reservations.js';

export async function writeShows(
  newShowsArray: ShowWithoutAvailableSeatCount[],
): Promise<void> {
  await writeJSONToFile(filenames.shows, newShowsArray);
}

export async function getShows(): Promise<Show[]> {
  const showsMinusAvailableSeatCount = await getJSONfromFile<ShowWithoutAvailableSeatCount>(
    filenames.shows,
  );
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
