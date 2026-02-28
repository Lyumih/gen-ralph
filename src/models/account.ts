export type HeroStats = {
  maxHp: number;
  attack: number;
  defense: number;
};

export type Hero = {
  id: string;
  name: string;
  level: number;
  exp: number;
  stats: HeroStats;
};

export type Account = {
  login: string;
  nickname: string;
  heroes: Hero[];
  activeHeroId?: string;
};
