using System.Net;
using MovieExplorer.API.Models;
using System.Text.Json;

namespace MovieExplorer.API.Services
{
    public class TMDbService : IMovieService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<TMDbService> _logger;
        private readonly string _apiKey;

        public TMDbService(HttpClient httpClient, IConfiguration configuration, ILogger<TMDbService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = configuration["TMDB:ApiKey"] ?? throw new ArgumentException("TMDB API Key is required");

            _httpClient.BaseAddress = new Uri("https://api.themoviedb.org/3/");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<MovieSearchResult> SearchMoviesAsync(string query, int page = 1)
        {
            try
            {
                _logger.LogInformation($"Searching movies with query: {query}, page: {page}");

                var response = await _httpClient.GetAsync($"search/movie?api_key={_apiKey}&query={WebUtility.UrlEncode(query)}&page={page}&language=en-US");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"TMDB API returned status: {response.StatusCode}");
                    throw new HttpRequestException($"TMDB API error: {response.StatusCode}");
                }

                var content = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<MovieSearchResult>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                _logger.LogInformation($"Found {result?.Results?.Count ?? 0} movies");
                return result ?? new MovieSearchResult();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching movies");
                throw;
            }
        }

        public async Task<Movie> GetMovieByIdAsync(int id)
        {
            try
            {
                _logger.LogInformation($"Getting movie details for ID: {id}");

                var response = await _httpClient.GetAsync($"movie/{id}?api_key={_apiKey}&language=en-US");
                return await HandleResponse<Movie>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting movie with ID: {id}");
                throw;
            }
        }

        public async Task<MovieSearchResult> GetPopularMoviesAsync(int page = 1)
        {
            try
            {
                _logger.LogInformation($"Getting popular movies, page: {page}");

                var response = await _httpClient.GetAsync($"movie/popular?api_key={_apiKey}&page={page}&language=en-US");
                return await HandleResponse<MovieSearchResult>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting popular movies");
                throw;
            }
        }

        public async Task<MovieSearchResult> GetNowPlayingMoviesAsync(int page = 1)
        {
            try
            {
                _logger.LogInformation($"Getting now playing movies, page: {page}");

                var response = await _httpClient.GetAsync($"movie/now_playing?api_key={_apiKey}&page={page}&language=en-US");
                return await HandleResponse<MovieSearchResult>(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting now playing movies");
                throw;
            }
        }

        public async Task<List<Genre>> GetGenresAsync()
        {
            try
            {
                _logger.LogInformation("Getting movie genres");

                var response = await _httpClient.GetAsync($"genre/movie/list?api_key={_apiKey}&language=en-US");
                var result = await HandleResponse<GenreResponse>(response);
                return result.Genres;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting genres");
                throw;
            }
        }

        private async Task<T> HandleResponse<T>(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError($"API Error: {response.StatusCode} - {errorContent}");
                throw new HttpRequestException($"TMDB API returned status code: {response.StatusCode}");
            }

            var content = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<T>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (result == null)
            {
                throw new Exception("Failed to deserialize API response");
            }

            return result;
        }
    }

    public class GenreResponse
    {
        public List<Genre> Genres { get; set; } = new();
    }
}