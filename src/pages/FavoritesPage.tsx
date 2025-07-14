import { observer } from "mobx-react-lite";
import { Group, Placeholder } from "@vkontakte/vkui";
import { Icon28FavoriteOutline } from "@vkontakte/icons";
import movieStore from "../stores/movieStore";
import { MovieCard } from "../components/movies/MovieCard";

export const FavoritesPage = observer(() => {
  return (
    <Group style={{ margin: 15 }}>
      {movieStore.favorites.length === 0 ? (
        <Placeholder icon={<Icon28FavoriteOutline width={56} height={56} />}>
          Нет избранных фильмов
        </Placeholder>
      ) : (
        movieStore.favorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      )}
    </Group>
  );
});
