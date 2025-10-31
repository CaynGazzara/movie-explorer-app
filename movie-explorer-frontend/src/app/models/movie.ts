export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string; // COM underline
  backdrop_path: string; // COM underline
  release_date: string; // COM underline
  vote_average: number; // COM underline
  vote_count: number; // COM underline
  genre_ids: number[]; // COM underline
  genres: Genre[];
  runtime?: number;
  original_language: string; // COM underline
  
  // Propriedades computadas (opcionais)
  fullPosterPath?: string;
  fullBackdropPath?: string;
}

export interface MovieSearchResult {
  results: Movie[];
  page: number;
  total_pages: number; // COM underline
  total_results: number; // COM underline
}

export interface Genre {
  id: number;
  name: string;
}
export interface SearchParams {
  query: string;
  page: number;
}