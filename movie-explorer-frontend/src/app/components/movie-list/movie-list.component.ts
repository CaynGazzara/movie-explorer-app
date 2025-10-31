import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genre, Movie, MovieSearchResult } from '../../models/movie';
import { MovieService } from '../../services/movie.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  standalone: false,
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  searchResult: MovieSearchResult | null = null;
  currentPage: number = 1;
  currentQuery: string = '';
  searchType: 'popular' | 'search' | 'now-playing' = 'popular';
  hasSearched: boolean = false;
  genres: Genre[] = [];
  loading: boolean = true;

  constructor(
    private movieService: MovieService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGenres();
  }

  loadGenres() {
    this.movieService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
        this.loadPopularMovies();
      },
      error: (error) => {
        console.error('Error loading genres:', error);
        this.loadPopularMovies();
      }
    });
  }

  onSearch(query: string) {
    this.currentQuery = query;
    this.currentPage = 1;
    this.searchType = 'search';
    this.hasSearched = true;
    this.performSearch(query, 1);
  }

  onClearSearch() {
    this.currentQuery = '';
    this.currentPage = 1;
    this.hasSearched = false;
    this.loadPopularMovies();
  }

  getGenreName(genreId: number): string {
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  }

  getRatingDisplay(rating: number | undefined): string {
    if (!rating || rating === 0) return 'N/A';
    return rating.toFixed(1);
  }

  getRatingColor(rating: number | undefined): string {
    if (!rating || rating === 0) return '#95a5a6';
    if (rating >= 7.5) return '#2ecc71';
    if (rating >= 6.0) return '#f39c12';
    return '#e74c3c';
  }

  getPages(): number[] {
    if (!this.searchResult) return [];
    
    const totalPages = this.searchResult.total_pages;
    const currentPage = this.currentPage;
    const pages: number[] = [];
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number) {
    if (page === this.currentPage) return;
    
    this.currentPage = page;
    
    if (this.searchType === 'search') {
      this.performSearch(this.currentQuery, page);
    } else if (this.searchType === 'popular') {
      this.loadPopularMovies(page);
    } else if (this.searchType === 'now-playing') {
      this.loadNowPlayingMovies(page);
    }
  }

  private performSearch(query: string, page: number) {
    this.loading = true;
    this.loadingService.show();

    this.movieService.searchMovies(query, page).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.movies = result.results || [];
        this.currentPage = result.page;
        this.loading = false;
        this.loadingService.hide();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error searching movies:', error);
        this.movies = [];
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }

  loadPopularMovies(page: number = 1) {
    this.loading = true;
    this.loadingService.show();
    this.searchType = 'popular';
    this.hasSearched = false;
    this.currentQuery = '';

    this.movieService.getPopularMovies(page).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.movies = result.results || [];
        this.currentPage = result.page;
        this.loading = false;
        this.loadingService.hide();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.movies = [];
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }

  loadNowPlayingMovies(page: number = 1) {
    this.loading = true;
    this.loadingService.show();
    this.searchType = 'now-playing';
    this.hasSearched = false;
    this.currentQuery = '';

    this.movieService.getNowPlayingMovies(page).subscribe({
      next: (result) => {
        this.searchResult = result;
        this.movies = result.results || [];
        this.currentPage = result.page;
        this.loading = false;
        this.loadingService.hide();
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error loading now playing movies:', error);
        this.movies = [];
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }

  nextPage() {
    if (this.searchResult && this.currentPage < this.searchResult.total_pages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  viewMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }

  handleImageError(event: any) {
    event.target.src = 'assets/no-poster.png';
  }
}