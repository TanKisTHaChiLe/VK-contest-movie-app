import React from 'react';
import { 
  SimpleCell, 
  Avatar, 
  Div,
  Title,
  Caption
} from '@vkontakte/vkui';
import { Icon12Star } from '@vkontakte/icons';
import { Movie } from '../../types/movie';
import { AddToFavorites } from '../favorites/AddToFavorites';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
const navigate = useNavigate();

const handleClick = () => {
  navigate(`/movie/${movie.id}`)
}

  return (
    <SimpleCell
      before={<Avatar src={movie.poster?.url} size={72} />}
      after={<AddToFavorites movie={movie} />}
      onClick={handleClick}
    >
      <Div>
        <Title level="3">{movie.name ? movie.name : movie.alternativeName}</Title>
        <Caption level="1" style={{display: 'flex', marginBlockStart: 5}}>
          <Icon12Star style={{marginInlineEnd: 2}}/> {movie.rating?.kp.toFixed(1)} · {movie.year}
        </Caption>
      </Div>
    </SimpleCell>
  );
};