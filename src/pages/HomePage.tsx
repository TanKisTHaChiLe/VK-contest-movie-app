import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { MovieList } from '../components/movies/MovieList';
import { Filters } from '../components/movies/Filters';
import { Group } from '@vkontakte/vkui';
import movieStore from '../stores/movieStore';

export const HomePage = observer(() => {
  useEffect(() => {
    movieStore.fetchMovies();
  }, []);

  return (
    <Group style={{margin:15}}>
      <Filters />
      <MovieList />
    </Group>
  );
});