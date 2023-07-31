interface GenericApiObject {
  $ref: string;
  $meta?: object;
}

interface GenericList<Type> extends GenericApiObject {
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
  types: GenericList<SeasonType>;
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

export type SeasonWeekList = GenericList<GenericApiObject>;

export interface SeasonWeek extends GenericApiObject {
  number: number;
  startDate: string;
  endDate: string;
  text: string;
  rankings: GenericApiObject;
  events: GenericApiObject;
  talentPicks: GenericApiObject;
}

export type SeasonWeekEventList = GenericList<GenericApiObject>;

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
