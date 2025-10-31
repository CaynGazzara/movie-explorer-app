import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie';
import { LoadingService } from '../../services/loading.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  standalone: false,
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadMovieDetails();
  }

  loadMovieDetails(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    
    if (!movieId) {
      this.error = 'Movie ID not found';
      this.loading = false;
      return;
    }

    this.loadingService.show();
    this.loading = true;

    this.movieService.getMovieById(+movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.loading = false;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
        this.error = 'Error loading movie details. Please try again.';
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
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

  formatRuntime(minutes: number | undefined): string {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/no-poster.svg';
  }
}