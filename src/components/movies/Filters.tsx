import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fethGetMovieFilters } from "../../api/movieAPI";
import {
  Group,
  Div,
  Title,
  FormItem,
  Checkbox,
  Button,
  Caption,
  Slider,
  Search,
  Spinner,
} from "@vkontakte/vkui";

const genresDefault = [
  "драма",
  "комедия",
  "фантастика",
  "ужасы",
  "триллер",
  "боевик",
  "детектив",
];

export const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [genres, setGenres] = useState<string[]>(genresDefault);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const parseParams = useCallback(() => {
    const rating = searchParams.get("rating.kp")
      ? searchParams.get("rating.kp")?.split("-").map(Number) as [number, number]
      : [0, 10];
    
    const year = searchParams.get("year")
      ? searchParams.get("year")?.split("-").map(Number) as [number, number]
      : [1990, new Date().getFullYear()];
      
    const genres = searchParams.getAll("genre");
    
    return { rating, year, genres };
  }, [searchParams]);

  const [filters, setFilters] = useState(parseParams());

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await fethGetMovieFilters();
        const genresName = response.data.map((genre) => genre.name);
        setGenres(genresName);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    setFilters(parseParams());
  }, [searchParams, parseParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (filters.rating[0] !== 0 || filters.rating[1] !== 10) {
      params.set("rating.kp", `${filters.rating[0]}-${filters.rating[1]}`);
    }
    
    if (filters.year[0] !== 1990 || filters.year[1] !== new Date().getFullYear()) {
      params.set("year", `${filters.year[0]}-${filters.year[1]}`);
    }
    
    filters.genres.forEach((g) => params.append("genre", g));
    
    if (params.get("rating.kp") === "0-10") params.delete("rating.kp");
    if (params.get("year") === `1990-${new Date().getFullYear()}`) params.delete("year");
    
    params.delete("search");
    setSearchParams(params);
  };

  const handleSearch = () => {
    setFilters({
      rating: [0, 10],
      year: [1990, new Date().getFullYear()],
      genres: [],
    });

    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilters({
      rating: [0, 10],
      year: [1990, new Date().getFullYear()],
      genres: [],
    });
    setSearchParams(new URLSearchParams());
  };

  const handleClearInput = () => {
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <Div>
        <Spinner size="large" />
      </Div>
    );
  }

  return (
    <Group>
      <Div>
        <Title
          level="3"
          style={{ fontSize: "20px", fontWeight: "600", marginBottom: 16 }}
        >
          Фильтры
        </Title>
      </Div>
      <FormItem>
        <div style={{ display: "flex", gap: 8 }}>
          <Search
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            after={
              searchQuery && (
                <Button
                  mode="tertiary"
                  onClick={handleClearInput}
                  aria-label="Очистить поиск"
                >
                  ×
                </Button>
              )
            }
            placeholder="Поиск по названию"
            style={{ flexGrow: 1 }}
          />
          {searchParams.has("search") && (
            <Button
              onClick={handleClearSearch}
              mode="tertiary"
              aria-label="Сбросить поиск"
              style={{ 
                minWidth: "auto",
                padding: "0 12px",
                flexShrink: 0,
                marginRight: 8
              }}
            >
              Сбросить
            </Button>
          )}
          <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
            Найти
          </Button>
        </div>
      </FormItem>
      <FormItem top="Рейтинг Кинопоиска">
        <div style={{ display: "flex", gap: "16px", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                fontWeight: "400",
                color: "var(--text_secondary)",
              }}
            >
              От
            </Caption>
            <Slider
              value={filters.rating[0]}
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => {
                if (value > filters.rating[1]) {
                  setFilters({
                    ...filters,
                    rating: [filters.rating[1], filters.rating[1]],
                  });
                } else {
                  setFilters({
                    ...filters,
                    rating: [value, filters.rating[1]],
                  });
                }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                fontWeight: "400",
                color: "var(--text_secondary)",
              }}
            >
              До
            </Caption>
            <Slider
              value={filters.rating[1]}
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => {
                if (value < filters.rating[0]) {
                  setFilters({
                    ...filters,
                    rating: [filters.rating[0], filters.rating[0]],
                  });
                } else {
                  setFilters({
                    ...filters,
                    rating: [filters.rating[0], value],
                  });
                }
              }}
            />
          </div>
        </div>
        <Caption
          level="1"
          style={{
            marginTop: 8,
            fontSize: "16px",
            fontWeight: "500",
            color: "var(--text_primary)",
          }}
        >
          Диапазон: {filters.rating[0].toFixed(1)} -{" "}
          {filters.rating[1].toFixed(1)}
        </Caption>
      </FormItem>

      <FormItem top="Год выпуска">
        <div style={{ display: "flex", gap: "16px", marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                fontWeight: "400",
                color: "var(--text_secondary)",
              }}
            >
              От
            </Caption>
            <Slider
              value={filters.year[0]}
              min={1990}
              step={1}
              max={new Date().getFullYear()}
              onChange={(value) => {
                if (value > filters.year[1]) {
                  setFilters({
                    ...filters,
                    year: [filters.year[1], filters.year[1]],
                  });
                } else {
                  setFilters({
                    ...filters,
                    year: [value, filters.year[1]],
                  });
                }
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "16px",
                marginBottom: "8px",
                fontWeight: "400",
                color: "var(--text_secondary)",
              }}
            >
              До
            </Caption>
            <Slider
              value={filters.year[1]}
              min={1990}
              max={new Date().getFullYear()}
              step={1}
              onChange={(value) => {
                if (value < filters.year[0]) {
                  setFilters({
                    ...filters,
                    year: [filters.year[0], filters.year[0]],
                  });
                } else {
                  setFilters({
                    ...filters,
                    year: [filters.year[0], value],
                  });
                }
              }}
            />
          </div>
        </div>
        <Caption
          level="1"
          style={{
            marginTop: 8,
            fontSize: "16px",
            fontWeight: "500",
            color: "var(--text_primary)",
          }}
        >
          Годы: {filters.year[0]} - {filters.year[1]}
        </Caption>
      </FormItem>

      <FormItem top="Жанры">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 16px",
            alignItems: "center",
          }}
        >
          {genres.map((genre) => (
            <div
              key={genre}
              style={{
                flex: "0 0 auto",
                minWidth: "120px",
                maxWidth: "100%",
              }}
            >
              <Checkbox
                checked={filters.genres.includes(genre)}
                onChange={() => {
                  setFilters({
                    ...filters,
                    genres: filters.genres.includes(genre)
                      ? filters.genres.filter((g) => g !== genre)
                      : [...filters.genres, genre],
                  });
                }}
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {genre}
              </Checkbox>
            </div>
          ))}
        </div>
      </FormItem>

      <Div>
        <Button
          size="l"
          stretched
          onClick={applyFilters}
          mode="primary"
          style={{ marginTop: 16 }}
        >
          Применить фильтры
        </Button>
      </Div>
    </Group>
  );
};