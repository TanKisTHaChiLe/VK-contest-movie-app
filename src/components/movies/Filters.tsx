import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Group,
  Div,
  Title,
  FormItem,
  Checkbox,
  Button,
  Caption,
  Slider,
} from "@vkontakte/vkui";

const genres = [
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

  const [filters, setFilters] = useState({
    rating: [0, 10] as [number, number],
    year: [1990, new Date().getFullYear()] as [number, number],
    genres: searchParams.getAll("genre"),
  });

  useEffect(() => {
    if (searchParams.get("rating.kp")) {
      filters.rating = searchParams
        .get("rating.kp")
        ?.split("-")
        .map(Number) as [number, number];
    }

    if (searchParams.get("year")) {
      filters.year = searchParams.get("year")?.split("-").map(Number) as [
        number,
        number
      ];
    }
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    params.set("rating.kp", `${filters.rating[0]}-${filters.rating[1]}`);
    params.set("year", `${filters.year[0]}-${filters.year[1]}`);
    filters.genres.forEach((g) => params.append("genre", g));
    setSearchParams(params);
  };

  return (
    <Group>
      <Div>
        <Title level="3" style={{ fontSize: "20px", fontWeight: "600" }}>
          Фильтры
        </Title>
      </Div>

      <FormItem top="Рейтинг Кинопоиска">
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "18px",
                marginBottom: "8px",
                fontWeight: "400",
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
                fontSize: "18px",
                marginBottom: "8px",
                fontWeight: "400",
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
          style={{ marginTop: 8, fontSize: "18px", fontWeight: "400" }}
        >
          Диапазон: {filters.rating[0].toFixed(1)} -{" "}
          {filters.rating[1].toFixed(1)}
        </Caption>
      </FormItem>

      <FormItem top="Год выпуска">
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <Caption
              level="1"
              style={{
                fontSize: "18px",
                marginBottom: "8px",
                fontWeight: "400",
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
                fontSize: "18px",
                marginBottom: "8px",
                fontWeight: "400",
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
          style={{ marginTop: 8, fontSize: "18px", fontWeight: "400" }}
        >
          Годы: {filters.year[0]} - {filters.year[1]}
        </Caption>
      </FormItem>

      <FormItem top="Жанры">
        {genres.map((genre) => (
          <Checkbox
            key={genre}
            checked={filters.genres.includes(genre)}
            onChange={() => {
              setFilters({
                ...filters,
                genres: filters.genres.includes(genre)
                  ? filters.genres.filter((g) => g !== genre)
                  : [...filters.genres, genre],
              });
            }}
            style={{ fontSize: "18px", fontWeight: "400" }}
          >
            {genre}
          </Checkbox>
        ))}
      </FormItem>

      <Div>
        <Button size="l" stretched onClick={applyFilters} mode="primary">
          Применить фильтры
        </Button>
      </Div>
    </Group>
  );
};
