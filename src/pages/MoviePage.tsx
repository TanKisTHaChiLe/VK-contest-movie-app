import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
  Group, 
  PanelHeader, 
  PanelHeaderBack, 
  Div, 
  Title, 
  Text, 
  Button, 
  Spinner,
  SimpleCell,
  Header,
  Card,
  CardGrid,
  Image
} from '@vkontakte/vkui';
import { 
  Icon20FavoriteOutline, 
  Icon20Favorite, 
  Icon12Clock,
  Icon12Star,
  Icon12InfoCircle
} from '@vkontakte/icons';
import movieStore from '../stores/movieStore';
import { fetchMovieById } from '../api/movieAPI';
import { Movie } from '../types/movie';
import { useNavigate } from 'react-router-dom';

interface MovieDetails extends Movie {
  movieLength?: number;
  ageRating?: number;
  description?: string;
  countries?: Array<{ name: string }>;
  persons?: Array<{
    id: number;
    name?: string;
    enName?: string;
    profession?: string;
    enProfession?: string;
    photo?: string;
  }>;
}

export const MoviePage = observer(() => {
  const { id } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
            //persons: data.data.persons || []
          } as MovieDetails);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  if (isLoading) return (
    <Div style={{ display: 'flex', justifyContent: 'center', padding: 50 }}>
      <Spinner size="large" />
    </Div>
  );

  if (!movie) return <Div>Фильм не найден</Div>;

  const isFavorite = movieStore.favorites.some(f => f.id === movie.id);
  const posterUrl = movie.poster.url;
  const rating = movie.rating.kp.toFixed(1);
  const year = movie.year;
  const movieLength = movie.movieLength ? `${movie.movieLength} мин.` : '—';
  const ageRating = movie.ageRating ? `${movie.ageRating}+` : '—';

  return (
    <>
      <PanelHeader before={<PanelHeaderBack onClick={() => navigate(-1)} />}>
        {movie.name}
      </PanelHeader>
      
      <Group>
        <Div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ 
            display: 'flex', 
            gap: 24, 
            flexWrap: 'wrap',
            alignItems: 'stretch'
          }}>
            <Card style={{ 
              width: 300, 
              flexShrink: 0,
              borderRadius: 8,
              overflow: 'hidden',
              display: 'flex'
            }}>
              <Image 
                src={posterUrl} 
                alt={movie.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Card>
            <div style={{ 
              flex: 1, 
              minWidth: 300,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}>
              <Title level="1" style={{ marginBottom: 4 }}>{movie.name}</Title>
              
              <div style={{ 
                display: 'flex', 
                gap: 16, 
                marginBottom: 8, 
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                {rating && rating !== '0.0' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon12Star fill="var(--vkui--color_icon_accent)" />
                    <Text weight="2">{rating}</Text>
                  </div>
                )}
                
                {year && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Text weight="2">{year}</Text>
                  </div>
                )}
                
                {movie.movieLength && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon12Clock />
                    <Text weight="2">{movie.movieLength} мин.</Text>
                  </div>
                )}
                
                {movie.ageRating && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon12InfoCircle />
                    <Text weight="2">{movie.ageRating}+</Text>
                  </div>
                )}
              </div>
              
              <Button
                size="l"
                mode={isFavorite ? "outline" : "primary"}
                before={isFavorite ? <Icon20Favorite fill="var(--vkui--color_icon_accent)" /> : <Icon20FavoriteOutline />}
                onClick={() => movieStore.toggleFavorite(movie)}
                style={{ 
                  marginBottom: 12,
                  alignSelf: 'flex-start'
                }}
              >
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}>
                {movie.genres.length > 0 && (
                  <div>
                    <Text weight="3" style={{ marginRight: 4 }}>Жанры:</Text>
                    <Text>{movie.genres.map(g => g.name).join(', ')}</Text>
                  </div>
                )}
                
                {movie.countries && movie.countries.length > 0 && (
                  <div>
                    <Text weight="3" style={{ marginRight: 4 }}>Страны:</Text>
                    <Text>{movie.countries.map(c => c.name).join(', ')}</Text>
                  </div>
                )}
              </div>
              
              {movie.description && (
                <div style={{ marginTop: 8 }}>
                  <Header mode="secondary" style={{ paddingLeft: 0 }}>Описание</Header>
                  <Text style={{ 
                    lineHeight: 1.6,
                    fontSize: 15
                  }}>
                    {movie.description}
                  </Text>
                </div>
              )}
            </div>
          </div>
          
          {/* {movie.persons && movie.persons.length > 0 && (
  <div style={{ marginTop: 16 }}>
    <Header mode="secondary" style={{ marginBottom: 16 }}>Актеры и создатели</Header>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 24,
      justifyItems: 'center'
    }}>
      {movie.persons.slice(0, 10).map(person => (
        <Card key={person.id} style={{ 
          width: 300,
          height: 400,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          {person.photo ? (
            <div style={{
              width: '100%',
              height: 300,
              position: 'relative'
            }}>
              <Image 
                src={person.photo} 
                alt={person.name || person.enName || ''}
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 300,
                  height: 300,
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>
          ) : (
            <div style={{
              width: '100%',
              height: 300,
              backgroundColor: 'var(--vkui--color_background_secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--vkui--color_text_secondary)',
              fontSize: 16
            }}>
              Нет фото
            </div>
          )}
          
          <div style={{ 
            padding: 16,
            height: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Title level="3" style={{ 
              marginBottom: 8,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              textAlign: 'center'
            }}>
              {person.name || person.enName || 'Неизвестно'}
            </Title>
            
            <Text 
              style={{ 
                color: 'var(--vkui--color_text_secondary)',
                fontSize: 14,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center'
              }}
            >
              {person.profession || person.enProfession || 'Актер'}
            </Text>
          </div>
        </Card>
      ))}
    </div>
  </div>
)} */}
        </Div>
      </Group>
    </>
  );
});