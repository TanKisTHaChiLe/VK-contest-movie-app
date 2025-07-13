import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import {
  Group,
  PanelHeader,
  PanelHeaderBack,
  Div,
  Title,
  Text,
  Button,
  Spinner,
  Header,
  Card,
  Image,
} from "@vkontakte/vkui";
import {
  Icon20FavoriteOutline,
  Icon20Favorite,
  Icon12Clock,
  Icon12Star,
  Icon12InfoCircle,
} from "@vkontakte/icons";
import movieStore from "../stores/movieStore";
import { fetchMovieById } from "../api/movieAPI";
import { MovieDetails } from "../types/movie";
import { AddToFavorites } from "../components/modals/AddToFavoritesModal/AddToFavorites";

export const MoviePage = observer(() => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const data = await fetchMovieById(parseInt(id));
          setMovie({
            ...data.data,
            genres: data.data.genres || [],
            countries: data.data.countries || [],
            persons: data.data.persons || [],
            premiere: data.data.premiere,
          } as MovieDetails);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  if (isLoading)
    return (
      <Div style={{ display: "flex", justifyContent: "center", padding: 50 }}>
        <Spinner size="large" />
      </Div>
    );

  if (!movie) return <Div>Фильм не найден</Div>;

  const isFavorite = movieStore.favorites.some((f) => f.id === movie.id);
  const posterUrl = movie.poster.url;
  const rating = movie.rating.kp.toFixed(1);
  const year = movie.year;
  const movieLength = movie.movieLength ? `${movie.movieLength} мин.` : null;
  const ageRating = movie.ageRating ? `${movie.ageRating}+` : null;

  const premiereDates = [
    movie.premiere?.country,
    movie.premiere?.world,
    movie.premiere?.cinema,
    movie.premiere?.bluray,
    movie.premiere?.dvd,
    movie.premiere?.digital,
    movie.premiere?.russia,
  ]
    .filter(Boolean)
    .map((date) => new Date(date as string));

  const earliestPremiereDate =
    premiereDates.length > 0
      ? new Date(Math.min(...premiereDates.map((date) => date.getTime())))
      : null;

  const premiereDate = earliestPremiereDate?.toLocaleDateString("ru-RU")
    ? earliestPremiereDate?.toLocaleDateString("ru-RU")
    : year;

  const actors =
    movie.persons
      ?.filter((p) => p.enProfession === "actor" || p.profession === "актеры")
      .slice(0, 8) || [];

  const directors =
    movie.persons?.filter(
      (p) => p.enProfession === "director" || p.profession === "режиссеры"
    ) || [];

  const handleGoBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleFavoriteClick = () => {
    setIsModalOpen(true);
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <>
      <PanelHeader
        style={{ position: "absolute" }}
        separator={false}
        before={<PanelHeaderBack onClick={handleGoBack} />}
      ></PanelHeader>

      <Group style={{ margin: 25 }}>
        <Div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              alignItems: "stretch",
            }}
          >
            <Card
              style={{
                width: 260,
                flexShrink: 0,
                borderRadius: 8,
                overflow: "hidden",
                display: "flex",
              }}
            >
              <Image
                src={posterUrl}
                alt={movie.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </Card>

            <div
              style={{
                flex: 1,
                minWidth: 300,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Title level="1" style={{ marginBottom: 4 }}>
                  {movie.name ? movie.name : movie.alternativeName}
                </Title>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 16,
                  marginBottom: 8,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {rating && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Icon12Star fill="var(--vkui--color_icon_accent)" />
                    <Text weight="2">{rating}</Text>
                  </div>
                )}
                {premiereDate && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Text weight="2">{premiereDate}</Text>
                  </div>
                )}
                {movieLength && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Icon12Clock />
                    <Text weight="2">{movieLength}</Text>
                  </div>
                )}

                {ageRating && (
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Icon12InfoCircle />
                    <Text weight="2">{ageRating}</Text>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button
                  size="l"
                  mode={isFavorite ? "outline" : "primary"}
                  before={
                    isFavorite ? (
                      <Icon20Favorite fill="var(--vkui--color_icon_accent)" />
                    ) : (
                      <Icon20FavoriteOutline />
                    )
                  }
                  onClick={handleFavoriteClick}
                >
                  {isFavorite ? "В избранном" : "В избранное"}
                </Button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {movie.genres.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <Text weight="2" style={{ marginRight: 4 }}>
                      Жанры:
                    </Text>
                    <Text>
                      {movie.genres.map((g, i) => (
                        <React.Fragment key={g.name}>
                          {i > 0 && ", "}
                          <span>{g.name}</span>
                        </React.Fragment>
                      ))}
                    </Text>
                  </div>
                )}

                {movie.countries && movie.countries.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    <Text weight="2" style={{ marginRight: 4 }}>
                      Страны:
                    </Text>
                    <Text>
                      {movie.countries.map((c, i) => (
                        <React.Fragment key={c.name}>
                          {i > 0 && ", "}
                          <span>{c.name}</span>
                        </React.Fragment>
                      ))}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>

          {movie.description && (
            <div style={{ marginTop: 24 }}>
              <Header
                mode="secondary"
                style={{ paddingLeft: 0, marginBottom: 12 }}
              >
                О фильме
              </Header>
              <Text
                style={{
                  lineHeight: 1.6,
                  fontSize: 15,
                }}
              >
                {movie.description}
              </Text>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <Header
              mode="secondary"
              style={{ paddingLeft: 0, marginBottom: 12 }}
            >
              Рейтинги
            </Header>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
              }}
            >
              <Card mode="outline">
                <Div>
                  <Text weight="3">Кинопоиск</Text>
                  <Title level="2" style={{ marginTop: 4 }}>
                    {movie.rating.kp.toFixed(1)}
                  </Title>
                  <Text
                    style={{
                      color: "var(--vkui--color_text_secondary)",
                      fontSize: 14,
                    }}
                  >
                    {formatNumber(movie.votes.kp)} оценок
                  </Text>
                </Div>
              </Card>

              <Card mode="outline">
                <Div>
                  <Text weight="3">IMDb</Text>
                  <Title level="2" style={{ marginTop: 4 }}>
                    {movie.rating.imdb?.toFixed(1)}
                  </Title>
                  <Text
                    style={{
                      color: "var(--vkui--color_text_secondary)",
                      fontSize: 14,
                    }}
                  >
                    {formatNumber(movie.votes.imdb)} оценок
                  </Text>
                </Div>
              </Card>

              {movie.rating.filmCritics > 0 && (
                <Card mode="outline">
                  <Div>
                    <Text weight="3">Критики</Text>
                    <Title level="2" style={{ marginTop: 4 }}>
                      {movie.rating.filmCritics.toFixed(1)}
                    </Title>
                    <Text
                      style={{
                        color: "var(--vkui--color_text_secondary)",
                        fontSize: 14,
                      }}
                    >
                      {formatNumber(movie.votes.filmCritics)} оценок
                    </Text>
                  </Div>
                </Card>
              )}
            </div>
          </div>

          {actors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Header
                mode="secondary"
                style={{ paddingLeft: 0, marginBottom: 12 }}
              >
                Актеры
              </Header>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 16,
                }}
              >
                {actors.map((person) => (
                  <Card
                    key={person.id}
                    style={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name || person.enName || ""}
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          backgroundColor:
                            "var(--vkui--color_background_secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--vkui--color_text_secondary)",
                          fontSize: 16,
                        }}
                      >
                        Нет фото
                      </div>
                    )}

                    <Div style={{ padding: 12 }}>
                      <Title
                        level="3"
                        style={{
                          marginBottom: 4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.3,
                          fontSize: 14,
                        }}
                      >
                        {person.name || person.enName || "Неизвестно"}
                      </Title>
                    </Div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {directors.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Header
                mode="secondary"
                style={{ paddingLeft: 0, marginBottom: 12 }}
              >
                Режиссеры
              </Header>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 16,
                }}
              >
                {directors.map((person) => (
                  <Card
                    key={person.id}
                    style={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    {person.photo ? (
                      <Image
                        src={person.photo}
                        alt={person.name || person.enName || ""}
                        style={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 160,
                          backgroundColor:
                            "var(--vkui--color_background_secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--vkui--color_text_secondary)",
                          fontSize: 16,
                        }}
                      >
                        Нет фото
                      </div>
                    )}

                    <Div style={{ padding: 12 }}>
                      <Title
                        level="3"
                        style={{
                          marginBottom: 4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.3,
                          fontSize: 14,
                        }}
                      >
                        {person.name || person.enName || "Неизвестно"}
                      </Title>
                    </Div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {movie.sequelsAndPrequels && movie.sequelsAndPrequels.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <Header
                mode="secondary"
                style={{ paddingLeft: 0, marginBottom: 12 }}
              >
                Сиквелы и приквелы
              </Header>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 16,
                }}
              >
                {movie.sequelsAndPrequels.map((item) => (
                  <Card
                    key={item.id}
                    style={{
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 8,
                      overflow: "hidden",
                    }}
                  >
                    {item.poster?.url ? (
                      <Image
                        src={item.poster.url}
                        alt={item.name || item.alternativeName || ""}
                        style={{
                          width: "100%",
                          height: 180,
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 180,
                          backgroundColor:
                            "var(--vkui--color_background_secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--vkui--color_text_secondary)",
                          fontSize: 16,
                        }}
                      >
                        Нет постера
                      </div>
                    )}

                    <Div style={{ padding: 12 }}>
                      <Title
                        level="3"
                        style={{
                          marginBottom: 4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.3,
                          fontSize: 14,
                        }}
                      >
                        {item.name || item.alternativeName || "Неизвестно"}
                      </Title>
                    </Div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Div>
      </Group>
      <AddToFavorites
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
});
