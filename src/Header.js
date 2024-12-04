import "./header.css";
export default function Header({ setFilter, setSearch }) {
  return (
    <>
      <nav>
        <h1>IMDb</h1>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#" onClick={() => setFilter("movie")}>
              Movies
            </a>
          </li>
          <li>
            <a href="#" onClick={() => setFilter("series")}>
              TV Shows
            </a>
          </li>
          <li>
            <a href="#">Favourites</a>
          </li>
        </ul>
        <input
          type="search"
          name="search"
          placeholder="Search movies or TV shows"
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>
    </>
  );
}
