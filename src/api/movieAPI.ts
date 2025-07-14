import { apiClient } from './client';
import { Movie, MovieDetails, MovieFilterParams, MovieGanres } from '../types/movie';

export const fetchMovies = (params?: MovieFilterParams) => {
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

  return apiClient.get<{ docs: Movie[] }>(`/v1.3/movie?${queryParams.toString()}`);
};

export const fetchMovieById = (id: number) => {
  return apiClient.get<MovieDetails>(`/v1.3/movie/${id}`);
};

export const fethGetMovieFilters = () => {
  return apiClient.get<MovieGanres[]>(`/v1/movie/possible-values-by-field?field=genres.name`)
}