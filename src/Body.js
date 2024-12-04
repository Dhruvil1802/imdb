import { useEffect, useState } from "react";
import "./body.css";

export default function Body({ filter, search }) {
  const [videos, setVideos] = useState("");
  const [year, setYear] = useState("");
  const [selectedItem, setSelectItem] = useState(null);
  const [selectedSeason, setSelectSeason] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [openSeason, setOpenSeasons] = useState(false);
  const [page, setPage] = useState(1);

  var years = [];

  for (var i = 2025; i >= 1950; i--) {
    years.push(i);
  }

  useEffect(() => {
    async function createSeasonArray() {
      const newSeasons = [];
      if (selectedItem) {
        for (let i = 0; i < Number(selectedItem.totalSeasons); i++) {
          newSeasons.push(i);
        }
      }

      setSeasons(newSeasons);
    }
    createSeasonArray();
  }, [selectedItem]);

  useEffect(() => {
    async function fetchMovies() {
      if (filter === "movie" || (filter === "series" && year)) {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&page=${page}&type=${filter}&y=${year}&apikey=b00bdafe`
        );
        const data = await res.json();
        setVideos(data.Search);
      } else if (filter === "movie" || filter === "series") {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&page=${page}&type=${filter}&apikey=b00bdafe`
        );
        const data = await res.json();
        setVideos(data.Search);
      } else if (year) {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&page=${page}&y=${year}&apikey=b00bdafe`
        );
        const data = await res.json();
        setVideos(data.Search);
      } else {
        const res = await fetch(
          `https://www.omdbapi.com/?s=${search}&page=${page}&apikey=b00bdafe`
        );
        const data = await res.json();
        setVideos(data.Search);
      }
    }
    fetchMovies();
  }, [filter, year, search, page]);

  async function fetchMovieDetails(id) {
    setSelectSeason(null);
    setSeasons([]);
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=b00bdafe`);
    const data = await res.json();

    setSelectItem(data);
  }

  async function fetchSeasonSeries(id, season) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&Season=${season}&apikey=b00bdafe`
    );
    const data = await res.json();

    setSelectSeason(data);
  }

  return (
    <main>
      <section>
        <div className="filter-movie-container">
          <h2>Movies List</h2>

          <div className="filter">
            <label for="year">Select Year:</label>
            <select name="year" onChange={(e) => setYear(e.target.value)}>
              <option value="">All Years</option>
              {years.map((year) => (
                <option value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

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
          <button onClick={() => setPage((page) => page - 1)}>Previous</button>
          <button onClick={() => setPage((page) => page + 1)}>Next</button>
        </div>
      </section>

      <section>
        <h2>Movie Details</h2>
        {selectedItem ? (
          <div className="movie-details-container">
            <div className="movie-header">
              <img
                src={selectedItem.Poster}
                alt={`${selectedItem.Title} Poster`}
                className="movie-detail-poster"
              />
              <div className="movie-info">
                <h3>{selectedItem.Title}</h3>
                <p>
                  <b>Genre:</b> {selectedItem.Genre || "N/A"}
                </p>
                <p>
                  <b>Actors:</b> {selectedItem.Actors || "N/A"}
                </p>
                <p>
                  <b>Language:</b> {selectedItem.Language || "N/A"}
                </p>
                <p>
                  <b>Released:</b> {selectedItem.Released || "N/A"}
                </p>
                <p>
                  <b>Plot:</b> {selectedItem.Plot || "N/A"}
                </p>
                <p>
                  <b>IMDB Rating:</b> {selectedItem.imdbRating || "N/A"}
                </p>

                <button className="add-to-favourite-button">
                  Add to Favourites
                </button>
              </div>
            </div>
            {selectedItem.Type === "series" ? (
              <div className="seasons-container">
                <h3>Seasons</h3>
                <div className="season-sections">
                  {seasons.map((index) => (
                    <div key={index} className="season-section">
                      <h4
                        onClick={() =>
                          fetchSeasonSeries(selectedItem.imdbID, index + 1)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        Season {index + 1}
                      </h4>
                      {selectedSeason &&
                        selectedSeason.Season === String(index + 1) && (
                          <ul className="episode-list">
                            {selectedSeason.Episodes.map((episode, i) => (
                              <li key={episode.imdbID} className="episode-item">
                                <p>
                                  <b>Episode:</b> {i + 1}
                                </p>
                                <p>
                                  <b>Title:</b> {episode.Title}
                                </p>
                                <p>
                                  <b>Released:</b> {episode.Released || "N/A"}
                                </p>
                                <p>
                                  <b>IMDB Rating:</b>{" "}
                                  {episode.imdbRating || "N/A"}
                                </p>
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          <p>Select a movie to see details here.</p>
        )}
      </section>
    </main>
  );
}
