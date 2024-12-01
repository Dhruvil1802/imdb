import { useEffect, useState } from "react";
import "./body.css";

export default function Body({ filter, setFilter }) {
  const [videos, setVideos] = useState("");
  const [year, setYear] = useState("");
  const [selectedItem, setSelectItem] = useState(null);

  var years = [];

  for (var i = 2025; i >= 1950; i--) {
    years.push(i);
  }

  useEffect(
    function () {
      async function fetchMovies() {
        if (filter === "movie" || (filter === "series" && year)) {
          const res = await fetch(
            `https://www.omdbapi.com/?s=Summer&page=1&type=${filter}&y=${year}&apikey=b00bdafe`
          );
          const data = await res.json();
          setVideos(data.Search);
        } else if (filter === "movie" || filter === "series") {
          const res = await fetch(
            `https://www.omdbapi.com/?s=Summer&page=1&type=${filter}&apikey=b00bdafe`
          );
          const data = await res.json();
          setVideos(data.Search);
        } else if (year) {
          const res = await fetch(
            `https://www.omdbapi.com/?s=Summer&page=1&y=${year}&apikey=b00bdafe`
          );
          const data = await res.json();
          setVideos(data.Search);
        } else {
          const res = await fetch(
            `https://www.omdbapi.com/?s=Summer&page=1&y=2000&apikey=b00bdafe`
          );
          const data = await res.json();
          setVideos(data.Search);
        }
      }
      fetchMovies();
    },
    [filter, year]
  );

  async function fetchMovieDetails(id) {
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=b00bdafe`);
    const data = await res.json();

    setSelectItem(data);
  }

  return (
    <main>
      <section>
        <div class="filter-movie-container">
          {/* <!-- Title: Movies List --> */}
          <h2>Movies List</h2>

          {/* <!-- Year Filter Dropdown --> */}
          <div class="filter">
            <label for="year">Select Year:</label>
            <select name="year" onChange={(e) => setYear(e.target.value)}>
              <option value="">All Years</option>
              {years.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* <!-- Movie List (below the title and filter) --> */}
        <ul className="movie-list-vertical">
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <li
                key={video.imdbID}
                className="movie-item-vertical"
                onClick={() => fetchMovieDetails(video.imdbID)}
              >
                <img
                  src={video.Poster}
                  alt={video.Title}
                  className="movie-poster-vertical"
                />
                <div className="movie-details">
                  <h3>{video.Title}</h3>
                  <p>
                    {video.Type} ({video.Year})
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </ul>

        <div>
          <button>Previous</button>
          <button>Next</button>
        </div>
      </section>

      <section>
        <h2>Movie Details</h2>
        {selectedItem ? (
          <div className="movie-details-container">
            <img
              src={selectedItem.Poster}
              alt={`${selectedItem.Title} Poster`}
              className="movie-detail-poster"
            />
            <div className="movie-info">
              <h3>{selectedItem.Title}</h3>
              <p>
                <strong>Genre:</strong> {selectedItem.Genre || "N/A"}
              </p>
              <p>
                <strong>Actors:</strong> {selectedItem.Actors || "N/A"}
              </p>
              <p>
                <strong>Language:</strong> {selectedItem.Language || "N/A"}
              </p>
              <p>
                <strong>Released:</strong> {selectedItem.Released || "N/A"}
              </p>
              <p>
                <strong>Plot:</strong> {selectedItem.Plot || "N/A"}
              </p>
              <p>
                <strong>IMDB Rating:</strong> {selectedItem.imdbRating || "N/A"}
              </p>
            </div>
          </div>
        ) : (
          <p>Select a movie to see details here.</p>
        )}
      </section>
    </main>
  );
}
