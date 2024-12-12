import { useEffect, useState } from "react";
import "./body.css";

export default function Body({ filter, search, favOpen }) {
  const [videos, setVideos] = useState("");
  const [year, setYear] = useState("");
  const [selectedItem, setSelectItem] = useState(null);
  const [selectedSeason, setSelectSeason] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [selectedepisode, setselectEpisode] = useState(null);

  // fetch favourite shows from the local storage
  const stored_favourite = JSON.parse(localStorage.getItem(`favourites`))
    ? JSON.parse(localStorage.getItem(`favourites`))
    : [];
  const [favourite, setFavourite] = useState(stored_favourite);

  var years = [];
  var stars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (var i = 2025; i >= 1950; i--) {
    years.push(i);
  }

  // create array of all the seasons of particular webseries whenever user selects item
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

  // fetch shows based on filter, year, search, page, favourites
  useEffect(() => {
    async function fetchMovies() {
      if (favOpen) {
        const favMovies = [];
        for (let i = 0; i < favourite.length; i++) {
          const res = await fetch(
            `http://www.omdbapi.com/?i=${favourite[i]}&apikey=b00bdafe`
          );
          const data = await res.json();
          favMovies.push(data);
        }
        setVideos(favMovies);
      } else if (filter === "movie" || (filter === "series" && year)) {
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
  }, [filter, year, search, page, favOpen, favourite]);

  // fetch details of shows
  async function fetchMovieDetails(id) {
    setSelectSeason(null);

    setSeasons([]);
    const res = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=b00bdafe`);
    const data = await res.json();

    setSelectItem(data);
  }

  // fetch details of season when user clicks on series
  async function fetchSeasonSeries(id, season) {
    const res = await fetch(
      `https://www.omdbapi.com/?i=${id}&Season=${season}&apikey=b00bdafe`
    );
    const data = await res.json();

    setSelectSeason(data);
  }

  // fetch details of episode  when user clicks on specific episode
  async function fetchEpisodeDetails(season, episode, title) {
    const res = await fetch(
      `https://www.omdbapi.com/?t=${title}&Season=${season}&Episode=${episode.Episode}&apikey=b00bdafe`
    );
    const data = await res.json();

    setselectEpisode(data);
  }

  return (
    <main>
      <section>
        <YearFilter setYear={setYear} years={years} favOpen={favOpen} />
        <MovieList videos={videos} fetchMovieDetails={fetchMovieDetails} />

        <Paginations setPage={setPage} />
      </section>
      <section>
        <MovieDetails
          selectedItem={selectedItem}
          seasons={seasons}
          fetchSeasonSeries={fetchSeasonSeries}
          selectedSeason={selectedSeason}
          fetchEpisodeDetails={fetchEpisodeDetails}
          selectedepisode={selectedepisode}
          stars={stars}
          setRating={setRating}
          rating={rating}
          setFavourite={setFavourite}
          favourite={favourite}
        />
      </section>
    </main>
  );
}

function MovieList({ videos, fetchMovieDetails }) {
  return (
    <>
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
    </>
  );
}
function YearFilter({ setYear, years, favOpen }) {
  return (
    <>
      <div className="filter-movie-container">
        {favOpen ? <h2>Favourite Movies List</h2> : <h2>Movies List</h2>}

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
    </>
  );
}
function Paginations({ setPage }) {
  return (
    <>
      <div>
        <button onClick={() => setPage((page) => (page > 1 ? page - 1 : page))}>
          Previous
        </button>

        <button onClick={() => setPage((page) => page + 1)}>Next</button>
      </div>
    </>
  );
}
function EpisodeDetails({ selectedepisode }) {
  return (
    <div className="episode-details">
      {selectedepisode ? (
        <div>
          <h3>{selectedepisode.Title}</h3>
          <p>
            <b>Episode:</b> {selectedepisode.Episode}
          </p>
          <p>
            <b>Released:</b> {selectedepisode.Released || "N/A"}
          </p>
          <p>
            <b>Duration:</b> {selectedepisode.Runtime || "N/A"}
          </p>
          <p>
            <b>Genre:</b> {selectedepisode.Genre || "N/A"}
          </p>
          <p>
            <b>Plot:</b> {selectedepisode.Plot || "N/A"}
          </p>
          <p>
            <b>IMDB Rating:</b> {selectedepisode.imdbRating || "N/A"}
          </p>
          <p>
            <b>Actors:</b> {selectedepisode.Actors || "N/A"}
          </p>
        </div>
      ) : (
        <p>Select an episode to see details here.</p>
      )}
    </div>
  );
}

function EpisodeList({
  selectedSeason,
  selectedItem,
  fetchEpisodeDetails,
  index,
}) {
  return (
    <div className="episodes">
      <ul className="episode-list">
        {selectedSeason.Episodes.map((episode, i) => (
          <li
            key={episode.imdbID}
            className="episode-item"
            onClick={() =>
              fetchEpisodeDetails(index + 1, episode, selectedItem.Title)
            }
          >
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
              <b>IMDB Rating:</b> {episode.imdbRating || "N/A"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SeasonList({
  selectedItem,
  seasons,
  fetchSeasonSeries,
  selectedSeason,
  fetchEpisodeDetails,
  selectedepisode,
}) {
  return (
    <>
      {/* display seasons of webseries */}
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
                    <div className="parent-episode">
                      <EpisodeList
                        selectedSeason={selectedSeason}
                        selectedItem={selectedItem}
                        fetchEpisodeDetails={fetchEpisodeDetails}
                        index={index}
                      />

                      <EpisodeDetails selectedepisode={selectedepisode} />
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

function MovieDetails({
  selectedItem,
  stars,
  setRating,
  rating,
  seasons,
  fetchSeasonSeries,
  selectedSeason,
  fetchEpisodeDetails,
  selectedepisode,
  favourite,
  setFavourite,
}) {
  // save favourite in local storage when user click on add to favourite button
  useEffect(
    function () {
      async function saveFavourite() {
        localStorage.setItem(`favourites`, JSON.stringify([...favourite]));
      }
      saveFavourite();
    },
    [favourite]
  );

  // save rating with its movie id in local storage when user rate movie
  useEffect(
    function () {
      async function saveRating() {
        selectedItem &&
          localStorage.setItem(
            `${selectedItem.imdbID}_rating`,
            JSON.stringify(rating)
          );
      }
      saveRating();
    },
    [rating]
  );

  // fetch rating when user selects any show if he previously rated that show
  useEffect(
    function () {
      async function getRating() {
        const saved_rating =
          selectedItem &&
          selectedItem.imdbID &&
          JSON.parse(localStorage.getItem(`${selectedItem.imdbID}_rating`))
            ? JSON.parse(localStorage.getItem(`${selectedItem.imdbID}_rating`))
            : 0;
        setRating(saved_rating);
      }
      getRating();
    },
    [selectedItem]
  );
  return (
    <>
      {/* display movie details */}
      <h2>Movie Details</h2>

      {selectedItem && selectedItem ? (
        <div className="movie-details-container">
          <div className="movie-header">
            <div className="movie-left">
              <img
                src={selectedItem.Poster}
                alt={`${selectedItem.Title} Poster`}
                className="movie-detail-poster"
              />
              {favourite.includes(selectedItem.imdbID) ? (
                <button
                  className="add-to-favourite"
                  onClick={() =>
                    setFavourite(
                      favourite.filter((id) => id !== selectedItem.imdbID)
                    )
                  }
                >
                  Remove from Favourite
                </button>
              ) : (
                <button
                  className="add-to-favourite"
                  onClick={() =>
                    setFavourite(() => [...favourite, selectedItem.imdbID])
                  }
                >
                  Add to Favourite
                </button>
              )}
            </div>
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
                <b>voters:</b> {selectedItem.imdbVotes || "N/A"}
              </p>
              <p>
                <b>IMDB Rating:</b>{" "}
                {rating === 0
                  ? selectedItem.imdbRating
                  : (Number(selectedItem.imdbRating) *
                      Number(selectedItem.imdbVotes) +
                      Number(rating)) /
                      (Number(selectedItem.imdbVotes) + 1) || "N/A"}
              </p>

              <p>
                <b>Your Rating:</b>
                {stars.map((i) => (
                  <span className="star" onClick={() => setRating(i)}>
                    {i <= rating ? "★" : "☆"}
                  </span>
                ))}
              </p>
            </div>
          </div>
          <SeasonList
            selectedItem={selectedItem}
            seasons={seasons}
            fetchSeasonSeries={fetchSeasonSeries}
            selectedSeason={selectedSeason}
            fetchEpisodeDetails={fetchEpisodeDetails}
            selectedepisode={selectedepisode}
          />
        </div>
      ) : (
        <p>Select a movie to see details here.</p>
      )}
    </>
  );
}
