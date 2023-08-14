/**
 * 
 * 
 * MISC TYPES
 * 
 */
export enum JobTypes {
  fetchSeason = 'fetch-season',
  fetchTeams = 'fetch-teams',
}


/**
 * 
 * 
 * ESPN API CLIENT TYPEES 
 * 
 */
interface GenericApiObject {
  $ref: string;
  $meta?: object;
}

interface GenericApiList<Type> extends GenericApiObject {
  count: number;
  pageIndex: number;
  pageCount: number;
  items: Type[];
}

export interface Season extends GenericApiObject {
  year: string;
  startDate: string;
  endDate: string;
  displayName: string;
  type: object;
  types: GenericApiList<SeasonType>;
  rankings: GenericApiObject;
  athletes: GenericApiObject;
  futures: GenericApiObject;
}

export interface SeasonType extends GenericApiObject {
  id: string;
  type: number;
  name: string;
  abbreviation: string;
  year: number;
  startDate: string;
  endDate: string;
  slug: string;
  groups: GenericApiObject;
  weeks: GenericApiObject;
  corrections: GenericApiObject;
}

export type SeasonWeekList = GenericApiList<GenericApiObject>;

export interface SeasonWeek extends GenericApiObject {
  number: number;
  startDate: string;
  endDate: string;
  text: string;
  rankings: GenericApiObject;
  events: GenericApiObject;
  talentPicks: GenericApiObject;
}

export type SeasonWeekEventList = GenericApiList<GenericApiObject>;

export interface Event extends GenericApiObject {
  id: string;
  uid: string;
  date: string;
  name: string;
  shortName: string;
  season: GenericApiObject;
  seasonType: GenericApiObject;
  week: GenericApiObject;
  timeValid: boolean;
  competitions: object[];
  competitors: CompetitorTeam[];
}

interface CompetitorTeam extends GenericApiObject {
  id: string;
  uid: string;
  type: 'team';
  order: number;
  homeAway: 'home' | 'away';
  team: GenericApiObject;
  score: GenericApiObject;
  record: GenericApiObject;
  previousCompetition: GenericApiObject;
  nextCompetition: GenericApiObject;
}

export type SeasonTeamsList = GenericApiList<GenericApiObject>;

export interface Team extends GenericApiObject {
  id: string;
  guid: string;
  uid: string;
  slug: string;
  location: string;
  name: string;
  nickname: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
  logos: ApiImage[];
  record: GenericApiObject;
  athletes: GenericApiObject;
  venue: Venue;
  groups: GenericApiObject;
  ranks: GenericApiObject;
  injuries: GenericApiObject;
  notes: GenericApiObject;
  againstTheSpreadRecords: GenericApiObject;
  franchise: GenericApiObject;
  depthCharts: GenericApiObject;
  events: GenericApiObject;
  coaches: GenericApiObject;
  links: object[];
}

interface ApiImage {
  href: string;
  width: number;
  height: number;
  alt: string;
  rel: string[];
  lastUpdated: string;
}

interface Venue extends GenericApiObject {
  id: string;
  fullName: string;
  address: {
    city: string;
    state: string;
    zipCode: string;
  };
  capacity: number;
  grass: boolean;
  indoor: boolean;
  images: ApiImage[];
}
