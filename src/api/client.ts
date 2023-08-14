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
} from '../types.js';

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
  seasonType: number | string,
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

interface FetchSeasonWeekOptions {
  year?: number;
  seasonType?: number;
  week?: number;
  $ref?: string;
}
export async function fetchSeasonWeek(
  options: FetchSeasonWeekOptions,
): Promise<SeasonWeek | null> {
  const { year, seasonType, week, $ref } = options;

  try {
    let response: AxiosResponse<SeasonWeek>;
    if ($ref) {
      response = await axios.get($ref);
    } else {
      const url = `/seasons/${year}/types/${seasonType}/weeks/${week}`;
      response = await axiosInstance.get(url);
    }
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

interface FetchSeasonWeekEventListOptions {
  year?: number;
  seasonType?: number;
  week?: number;
  $ref?: string;
}
export async function fetchSeasonWeekEventList(
  options: FetchSeasonWeekEventListOptions,
): Promise<SeasonWeekEventList | null> {
  const { year, seasonType, week, $ref } = options;

  try {
    let response: AxiosResponse<SeasonWeekEventList>;
    if ($ref) {
      response = await axios.get($ref);
    } else {
      const url = `/seasons/${year}/types/${seasonType}/weeks/${week}/events`;
      response = await axiosInstance.get(url);
    }
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
}

interface FetchEventOptions {
  eventId?: number;
  $ref?: string;
}
export async function fetchEvent(
  options: FetchEventOptions,
): Promise<Event | null> {
  const { eventId, $ref } = options;

  try {
    let response: AxiosResponse<Event>;
    if ($ref) {
      response = await axios.get($ref);
    } else {
      const url = `/events/${eventId}`;
      response = await axiosInstance.get(url);
    }
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
