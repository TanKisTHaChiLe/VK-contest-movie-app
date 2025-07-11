import { apiClient } from './client';
import { Movie, MovieDetails, MovieFilters } from '../types/movie';

export const fetchMovies = (params?: MovieFilters) => {
  const queryParams = new URLSearchParams();

  if(params){
    if(params['rating.kp']){
      queryParams.set('rating.kp', params['rating.kp'])
    }
    if(params.year){
      queryParams.set('year', params.year);
    }
    if(params.genres && params.genres.length>0){
      params.genres.forEach(genre => {
        console.log(genre)
        queryParams.append('genres.name', `+${genre}`)
      })
    }
  }
queryParams.set('page', `${params?.page}`)
queryParams.set('limit', '50');
console.log(queryParams.toString())
  return apiClient.get<{ docs: Movie[] }>(`/movie?${queryParams.toString()}`);
};

export const fetchMovieById = (id: number) => {
  return apiClient.get<MovieDetails>(`/movie/${id}`);
};