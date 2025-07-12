import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Group, Spinner } from '@vkontakte/vkui';
import { MovieCard } from './MovieCard';
import movieStore from '../../stores/movieStore';
import { useSearchParams } from 'react-router-dom';

export const MovieList = observer(() => {
  const [searchParams] = useSearchParams();
  const { movies, isLoading, hasMore, fetchMovies } = movieStore;
  const sentinelRef = useRef(null);

  useEffect(() => {
    const params = {
      'rating.kp': searchParams.get('rating.kp'),
      year: searchParams.get('year'),
      genres: searchParams.getAll('genre')
    };

    fetchMovies(params, true); 
  }, [searchParams]);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          const params = {
            'rating.kp': searchParams.get('rating.kp'),
            year: searchParams.get('year'),
            genres: searchParams.getAll('genre')
          };
          
          fetchMovies(params);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isLoading, hasMore, fetchMovies, searchParams]);

  return (
    <Group >
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      <div ref={sentinelRef} style={{ height: '20px' }} />
      {isLoading && <Spinner size="large" />}
      {!hasMore && movies.length > 0 && (
        <div style={{ textAlign: 'center', padding: 16 }}>
          Это все фильмы по вашему запросу
        </div>
      )}
    </Group>
  );
});