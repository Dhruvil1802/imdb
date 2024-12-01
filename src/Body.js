import "./body.css";
export default function Body() {
  return (
    <main>
      <section>
        <h2>Movies List</h2>
        <div class="filter">
          <label for="year">Select Year:</label>
          <select id="year" name="year">
            <option value="">All Years</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <ul>
          <li>
            <a href="#">Movie 1</a>
          </li>
          <li>
            <a href="#">Movie 2</a>
          </li>
          <li>
            <a href="#">Movie 3</a>
          </li>
          <li>
            <a href="#">Movie 4</a>
          </li>
        </ul>
        <div>
          <button>Previous</button>
          <button>Next</button>
        </div>
      </section>
      <section>
        <h2>Movie Details</h2>
        <div>
          <p>Select a movie to see details here.</p>
        </div>
      </section>
    </main>
  );
}
