import { makeAutoObservable, runInAction } from "mobx";
import { fetchMovies,fetchSearchMovie } from "../api/movieAPI";
import { Movie,MovieFilterParams } from "../types/movie";

class MovieStore {
  movies: Movie[] = [];
  favorites: Movie[] = [];
  isLoading = false;
  page = 1;
  hasMore = true;

  constructor() {
    makeAutoObservable(this);
    this.fetchMovies = this.fetchMovies.bind(this);
    this.loadFavorites();
  }

  async fetchMovies(params?: MovieFilterParams, reset = false) {
    if (reset) {
      runInAction(() => {
        this.movies = [];
        this.page = 1;
        this.hasMore = true;
      });
    }

    if (!this.hasMore || this.isLoading) return;

    this.isLoading = true;
    try {
      let response: {data: {docs:Movie[]}};
      if(params?.query?.length){
         response = await fetchSearchMovie({...params, page: this.page});
      } else{
        response = await fetchMovies({ ...params, page: this.page });
      }
      runInAction(() => {
        this.movies = [...this.movies, ...response.data.docs];
        this.hasMore = response.data.docs.length > 0;
        this.page++;

      });
    } catch (error) {
      runInAction(() => {
        this.hasMore = false;
      });
      console.error("Error fetching movies:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  toggleFavorite(movie: Movie) {
    const exists = this.favorites.some((f) => f.id === movie.id);
    if (exists) {
      this.favorites = this.favorites.filter((f) => f.id !== movie.id);
    } else {
      this.favorites.push(movie);
    }
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  private loadFavorites() {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        this.favorites = JSON.parse(saved);
      } catch {
        this.favorites = [];
      }
    }
  }
}

const movieStore = new MovieStore();
export default movieStore;
