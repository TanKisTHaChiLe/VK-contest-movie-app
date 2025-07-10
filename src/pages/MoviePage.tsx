import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Group, PanelHeader, PanelHeaderBack, Div, Title, Text, Button } from '@vkontakte/vkui';
import { Icon20FavoriteOutline, Icon20Favorite } from '@vkontakte/icons';
import movieStore from '../stores/movieStore';
import { fetchMovieById } from '../api/movieAPI';
import { MovieDetails } from '../types/movie';

export const MoviePage = observer(() => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        const data = await fetchMovieById(parseInt(id));
        setMovie(data.data);
      }
    };
    loadMovie();
  }, [id]);

  if (!movie) return <Div>Загрузка...</Div>;

  const isFavorite = movieStore.favorites.some(f => f.id === movie.id);

  return (
    <>
      <PanelHeader before={<PanelHeaderBack />}>
        {movie.name}
      </PanelHeader>
      <Group>
        <Div>
          <Title level="1">{movie.name}</Title>
          <Text>Рейтинг: {movie.rating?.kp.toFixed(1)}</Text>
          <Text>{movie.description}</Text>
          <Button
            size="l"
            before={isFavorite ? <Icon20Favorite /> : <Icon20FavoriteOutline />}
            onClick={() => movieStore.toggleFavorite(movie)}
          >
            {isFavorite ? 'В избранном' : 'В избранное'}
          </Button>
        </Div>
      </Group>
    </>
  );
});