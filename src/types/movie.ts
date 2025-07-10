export interface Movie {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  rating: {
    kp: number;
    imdb?: number;
  };
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
  countries?: Array<{
    name: string;
  }>;
}

export type MovieFilters = {
  'rating.kp'?: string;
  year?: string;
  genres?: string[];
  page?: number;
  limit?: number;
};