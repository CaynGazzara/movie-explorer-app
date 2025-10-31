using Microsoft.AspNetCore.Mvc;
using MovieExplorer.API.Models;
using MovieExplorer.API.Services;

namespace MovieExplorer.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieService _movieService;
        private readonly ILogger<MoviesController> _logger;

        public MoviesController(IMovieService movieService, ILogger<MoviesController> logger)
        {
            _movieService = movieService;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<MovieSearchResult>> SearchMovies([FromQuery] string query, [FromQuery] int page = 1)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                    return BadRequest("Search query is required");

                var result = await _movieService.SearchMoviesAsync(query, page);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching movies");
                return StatusCode(500, "An error occurred while searching movies");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            try
            {
                var movie = await _movieService.GetMovieByIdAsync(id);
                return Ok(movie);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting movie with ID: {id}");
                return StatusCode(500, "An error occurred while getting movie details");
            }
        }

        [HttpGet("popular")]
        public async Task<ActionResult<MovieSearchResult>> GetPopularMovies([FromQuery] int page = 1)
        {
            try
            {
                var result = await _movieService.GetPopularMoviesAsync(page);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting popular movies");
                return StatusCode(500, "An error occurred while getting popular movies");
            }
        }

        [HttpGet("now-playing")]
        public async Task<ActionResult<MovieSearchResult>> GetNowPlayingMovies([FromQuery] int page = 1)
        {
            try
            {
                var result = await _movieService.GetNowPlayingMoviesAsync(page);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting now playing movies");
                return StatusCode(500, "An error occurred while getting now playing movies");
            }
        }

        [HttpGet("genres")]
        public async Task<ActionResult<List<Genre>>> GetGenres()
        {
            try
            {
                var genres = await _movieService.GetGenresAsync();
                return Ok(genres);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting genres");
                return StatusCode(500, "An error occurred while getting genres");
            }
        }
    }
}