using System.Text.Json.Serialization;

namespace MovieExplorer.API.Models
{
    public class Movie
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("overview")]
        public string Overview { get; set; } = string.Empty;

        [JsonPropertyName("poster_path")]
        public string PosterPath { get; set; } = string.Empty;

        [JsonPropertyName("backdrop_path")]
        public string BackdropPath { get; set; } = string.Empty;

        [JsonPropertyName("release_date")]
        public string ReleaseDate { get; set; } = string.Empty;

        [JsonPropertyName("vote_average")]
        public double VoteAverage { get; set; }

        [JsonPropertyName("vote_count")]
        public int VoteCount { get; set; }

        [JsonPropertyName("genre_ids")]
        public List<int> GenreIds { get; set; } = new();

        [JsonPropertyName("genres")]
        public List<Genre> Genres { get; set; } = new();

        [JsonPropertyName("runtime")]
        public int? Runtime { get; set; }

        [JsonPropertyName("original_language")]
        public string OriginalLanguage { get; set; } = string.Empty;

        public string FullPosterPath => !string.IsNullOrEmpty(PosterPath)
            ? $"https://image.tmdb.org/t/p/w500{PosterPath}"
            : "/images/no-poster.png";

        public string FullBackdropPath => !string.IsNullOrEmpty(BackdropPath)
            ? $"https://image.tmdb.org/t/p/w1280{BackdropPath}"
            : "/images/no-backdrop.png";
    }

    public class MovieSearchResult
    {
        [JsonPropertyName("results")]
        public List<Movie> Results { get; set; } = new();

        [JsonPropertyName("page")]
        public int Page { get; set; }

        [JsonPropertyName("total_pages")]
        public int TotalPages { get; set; }

        [JsonPropertyName("total_results")]
        public int TotalResults { get; set; }
    }

    public class Genre
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}