import { apiClient } from './client';
import { Movie, MovieDetails, MovieFilters } from '../types/movie';

export const fetchMovies = (params?: MovieFilters) => {
  return apiClient.get<{ docs: Movie[] }>('/movie', { 
    params: { ...params, limit: 50 } 
  });
};

export const fetchMovieById = (id: number) => {
  return apiClient.get<MovieDetails>(`/movie/${id}`);
};