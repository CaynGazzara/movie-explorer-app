using MovieExplorer.API.Models;

namespace MovieExplorer.API.Services
{
    public interface IMovieService
    {
        Task<MovieSearchResult> SearchMoviesAsync(string query, int page = 1);
        Task<Movie> GetMovieByIdAsync(int id);
        Task<MovieSearchResult> GetPopularMoviesAsync(int page = 1);
        Task<MovieSearchResult> GetNowPlayingMoviesAsync(int page = 1);
        Task<List<Genre>> GetGenresAsync();
    }
}