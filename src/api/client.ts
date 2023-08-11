import axios, { Axios, AxiosResponse } from 'axios';

import {
  Season,
  SeasonType,
  SeasonWeek,
  SeasonWeekEventList,
  SeasonWeekList,
  Event,
  SeasonTeamsList,
  Team,
} from './types.js';

const ESPN_API_ROOT = 'https://sports.core.api.espn.com/v2/sports';
const NFL_API_ROOT = `${ESPN_API_ROOT}/football/leagues/nfl/`;

const axiosInstance = axios.create({
  baseURL: NFL_API_ROOT,
  timeout: 500,
});

function handleError(error: any) {
  console.log('API ERROR', '-------------------------------');
  console.error(error);
  if (axios.isAxiosError(error)) {
    // do something
  } else {
    // do something else
  }
}

export async function fetchSeason(year: number): Promise<Season | null> {
  const url = `/seasons/${year}`;
  try {
    const response: AxiosResponse<Season> = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchSeasonType(
  year: number,
  seasonType: number,
): Promise<SeasonType | null> {
  const url = `/seasons/${year}/types/${seasonType}`;
  try {
    const response: AxiosResponse<SeasonType> = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchSeasonWeekList(
  year: number,
  seasonType: number,
): Promise<SeasonWeekList | null> {
  const url = `/seasons/${year}/types/${seasonType}/weeks`;
  try {
    const response: AxiosResponse<SeasonWeekList> = await axiosInstance.get(
      url,
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchSeasonWeek(
  year: number,
  seasonType: number,
  week: number,
): Promise<SeasonWeek | null> {
  const url = `/seasons/${year}/types/${seasonType}/weeks/${week}`;
  try {
    const response: AxiosResponse<SeasonWeek> = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchSeasonWeekEventList(
  year: number,
  seasonType: number,
  week: number,
): Promise<SeasonWeekEventList | null> {
  const url = `/seasons/${year}/types/${seasonType}/weeks/${week}/events`;
  try {
    const response: AxiosResponse<SeasonWeekEventList> =
      await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchEvent(eventId: number): Promise<Event | null> {
  const url = `/events/${eventId}`;
  try {
    const response: AxiosResponse<Event> = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function fetchTeamList(
  season?: number,
): Promise<SeasonTeamsList | null> {
  const url = season ? `/seasons/${season}/teams` : `/teams`;
  try {
    const response: AxiosResponse<SeasonTeamsList> = await axiosInstance.get(
      url,
      {
        params: {
          limit: 32,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

interface FetchTeamOptions {
  teamId?: string;
  season?: string;
  $ref?: string;
}
export async function fetchTeam(
  options: FetchTeamOptions,
): Promise<Team | null> {
  const { teamId, season, $ref } = options;

  try {
    let response: AxiosResponse<Team>;
    if ($ref) {
      response = await axios.get($ref);
    } else {
      const url = season
        ? `/seasons/${season}/teams/${teamId}`
        : `/teams/${teamId}`;
      response = await axiosInstance.get(url);
    }
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}
