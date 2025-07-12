export interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  rating: Media;
  poster: {
    url: string;
    previewUrl?: string;
  };
  genres: Array<{
    name: string;
  }>;
}

export interface MovieDetails extends Movie {
  description: string;
  similarMovies?: Movie[];
  ageRating?: number;
  movieLength?: number;
  slogan?: string;
  countries?: Array<{
    name: string;
  }>;
  persons?: Array<{
    id: number;
    name?: string;
    enName?: string;
    profession?: string;
    description?: string;
    enProfession?: string;
    photo?: string;
  }>;
  premiere?: PremiereDates;
  votes: Media;
  sequelsAndPrequels:SequelsAndPrequels[];
}

interface PremiereDates {
  country: string | null;
  digital: string | null;
  cinema: string | null;
  bluray: string | null;
  dvd: string | null;
  russia: string | null;
  world: string | null;
}

interface Media {
  kp: number;
  imdb: number;
  filmCritics: number;
  russianFilmCritics: number;
  await: number;
}

interface SequelsAndPrequels {
  id: number;
  name: string;
  alternativeName: string;
  enName: string | null;
  type: string;
  poster: {
    url: string;
    previewUrl: string;
  };
}

export type MovieFilters = {
  "rating.kp"?: string;
  year?: string;
  genres?: string[];
  page?: number;
  limit?: number;
};
