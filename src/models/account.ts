export type Hero = {
  id: string;
  name: string;
};

export type Account = {
  login: string;
  nickname: string;
  heroes: Hero[];
  activeHeroId?: string;
};
