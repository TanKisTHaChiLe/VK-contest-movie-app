import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SimpleCell,
  Avatar,
  Div,
  Title,
  Caption,
  IconButton,
} from "@vkontakte/vkui";
import {
  Icon12Star,
  Icon20Favorite,
  Icon20FavoriteOutline,
} from "@vkontakte/icons";
import { Movie } from "../../types/movie";
import { AddToFavorites } from "../modals/AddToFavoritesModal/AddToFavorites";
import movieStore from "../../stores/movieStore";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const isFavorite = movieStore.favorites.some((f) => f.id === movie.id);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [isModalOpen]);

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <SimpleCell
        before={<Avatar src={movie.poster?.url} size={72} />}
        after={
          <IconButton onClick={handleStarClick}>
            {isFavorite ? <Icon20Favorite /> : <Icon20FavoriteOutline />}
          </IconButton>
        }
        onClick={handleClick}
      >
        <Div>
          <Title level="3">
            {movie.name ? movie.name : movie.alternativeName}
          </Title>
          <Caption level="1" style={{ display: "flex", marginBlockStart: 5 }}>
            <Icon12Star style={{ marginInlineEnd: 2 }} />{" "}
            {movie.rating?.kp.toFixed(1)} · {movie.year}
          </Caption>
        </Div>
      </SimpleCell>

      <AddToFavorites
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
