import "./header.css";
export default function Header() {
  return (
    <>
      <nav>
        <h1>IMDb</h1>
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Movies</a>
          </li>
          <li>
            <a href="#">TV Shows</a>
          </li>
          <li>
            <a href="#">Favourites</a>
          </li>
        </ul>
        <input
          type="search"
          name="search"
          placeholder="Search movies or TV shows"
        />
      </nav>
    </>
  );
}
