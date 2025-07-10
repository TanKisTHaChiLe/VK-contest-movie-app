import React, { useState } from 'react';
import { 
  Button, 
  ModalRoot, 
  ModalPage, 
  ModalPageHeader,
  Div,
  Text
} from '@vkontakte/vkui';
import { Icon20Favorite, Icon20FavoriteOutline } from '@vkontakte/icons';
import { Movie } from '../../types/movie';
import movieStore from '../../stores/movieStore';

interface AddToFavoritesProps {
  movie: Movie;
}

export const AddToFavorites: React.FC<AddToFavoritesProps> = ({ movie }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const isFavorite = movieStore.favorites.some(f => f.id === movie.id);

  const handleConfirm = () => {
    movieStore.toggleFavorite(movie);
    setActiveModal(null);
  };

  return (
    <>
      <Button 
        mode="tertiary"
        before={isFavorite ? <Icon20Favorite /> : <Icon20FavoriteOutline />}
        onClick={() => setActiveModal('confirm')}
      />

      <ModalRoot activeModal={activeModal}>
        <ModalPage 
          id="confirm" 
          onClose={() => setActiveModal(null)}
          header={
            <ModalPageHeader>
              {isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            </ModalPageHeader>
          }
        >
          <Div>
            <Text>
              {isFavorite 
                ? `Удалить "${movie.name}" из избранного?`
                : `Добавить "${movie.name}" в избранное?`}
            </Text>
          </Div>
          <Div>
            <Button 
              size="l" 
              stretched 
              mode="primary"
              onClick={handleConfirm}
            >
              {isFavorite ? 'Удалить' : 'Добавить'}
            </Button>
          </Div>
        </ModalPage>
      </ModalRoot>
    </>
  );
};