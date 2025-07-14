import React from "react";
import { createPortal } from "react-dom";
import {
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Div,
  Text,
  Button,
} from "@vkontakte/vkui";
import { Movie } from "../../../types/movie";
import movieStore from "../../../stores/movieStore";
import "./AddToFavorites.css";

interface AddToFavoritesProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToFavorites: React.FC<AddToFavoritesProps> = ({
  movie,
  isOpen,
  onClose,
}) => {
  const isFavorite = movieStore.favorites.some((f) => f.id === movie.id);

  const handleConfirm = () => {
    movieStore.toggleFavorite(movie);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      <ModalRoot activeModal="confirm">
        <ModalPage
          id="confirm"
          onClose={onClose}
          settlingHeight={100}
          hideCloseButton={false}
          header={
            <ModalPageHeader>
              {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
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
            <Button size="l" stretched mode="primary" onClick={handleConfirm}>
              {isFavorite ? "Удалить" : "Добавить"}
            </Button>
          </Div>
        </ModalPage>
      </ModalRoot>
    </div>,
    document.body
  );
};
