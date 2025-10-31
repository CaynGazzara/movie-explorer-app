import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // ADICIONAR tap AQUI
import { Movie, MovieSearchResult, Genre } from '../models/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'https://localhost:7104/api/movies';

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  searchMovies(query: string, page: number = 1): Observable<MovieSearchResult> {
    let params = new HttpParams()
      .set('query', query)
      .set('page', page.toString());

    console.log('📡 Searching movies:', { query, page });

    return this.http.get<MovieSearchResult>(`${this.apiUrl}/search`, { params })
      .pipe(
        tap(result => console.log('✅ Search results:', result)),
        catchError(this.handleError<MovieSearchResult>('searchMovies', { 
          results: [], 
          page: 1, 
          total_pages: 0, 
          total_results: 0 
        }))
      );
  }

  getMovieById(id: number): Observable<Movie> {
    console.log('📡 Fetching movie by ID:', id);
    
    return this.http.get<Movie>(`${this.apiUrl}/${id}`)
      .pipe(
        tap(movie => console.log('✅ Movie details:', movie)),
        catchError(this.handleError<Movie>('getMovieById'))
      );
  }

  getPopularMovies(page: number = 1): Observable<MovieSearchResult> {
    let params = new HttpParams()
      .set('page', page.toString());

    console.log('📡 Fetching popular movies, page:', page);

    return this.http.get<MovieSearchResult>(`${this.apiUrl}/popular`, { params })
      .pipe(
        tap(result => console.log('✅ Popular movies:', result)),
        catchError(this.handleError<MovieSearchResult>('getPopularMovies', { 
          results: [], 
          page: 1, 
          total_pages: 0, 
          total_results: 0 
        }))
      );
  }

  getNowPlayingMovies(page: number = 1): Observable<MovieSearchResult> {
    let params = new HttpParams()
      .set('page', page.toString());

    console.log('📡 Fetching now playing movies, page:', page);

    return this.http.get<MovieSearchResult>(`${this.apiUrl}/now-playing`, { params })
      .pipe(
        tap(result => console.log('✅ Now playing movies:', result)),
        catchError(this.handleError<MovieSearchResult>('getNowPlayingMovies', { 
          results: [], 
          page: 1, 
          total_pages: 0, 
          total_results: 0 
        }))
      );
  }

  getGenres(): Observable<Genre[]> {
    console.log('📡 Fetching genres');
    
    return this.http.get<Genre[]>(`${this.apiUrl}/genres`)
      .pipe(
        tap(genres => console.log('✅ Genres:', genres)),
        catchError(this.handleError<Genre[]>('getGenres', []))
      );
  }
}