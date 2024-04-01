/* 
<tr>
  <td>ALBUM NAME HERE</td>
  <td>RELEASE DATE HERE</td>
  <td>ARTIST NAME HERE</td>
  <td>GENRE HERE</td>
  <td>AVERAGE RATING HERE</td>
  <td>NUMBER OF RATINGS HERE</td>
</tr> 
*/

// Task 1 
let albumStore;

async function fetchAlbumData() {
  try {
    const res = await fetch('public/data/albums.json');
    const payload = await res.json();
    albumStore = payload;
    const albumStoreCopy = [...albumStore];
    render(albumStoreCopy);
  } catch (error) {
    console.error("Could not fetch albums:", error); // throws error if fetch fails
  }
}

fetchAlbumData();

// Task 2
document.getElementById('album-search-form').addEventListener('submit', onFilterRequest);

function onFilterRequest(e) {
  e.preventDefault();

  const searchQuery = document.getElementById('search-input').value.trim().toLowerCase();
  const minRating = parseFloat(document.getElementById('min-album-rating-input').value);
  const albumFilter = filterData(searchQuery);
  const ratingFilter = searchRating(minRating);

  // Combines text and rating filters, if both are present, intersects their results. Otherwise, returns the result of one or defaults to the full album store.
  const combinedResults = (albumFilter && ratingFilter) ?
    albumFilter.filter(album => ratingFilter.includes(album)) :
    (albumFilter || ratingFilter || albumStore);

  render(combinedResults);
}

// Text Input Field Search
function filterData(input) {
  if (!input) return null; // returns null if input is false 

  return albumStore.filter(album =>
    album.artistName.trim().toLowerCase().includes(input) || album.album.trim().toLowerCase().includes(input)
  );
}

// Number Text Field Search
function searchRating(minRating) {
  // Checks if minRating is anything false
  if (!minRating) return null;

  // If minRating is true continue with filtering
  return albumStore.filter(album => album.averageRating >= minRating);
}


function render(albums) {
  const table = document.getElementById('album-rows');
  table.innerHTML = '';

  // Sort the albums by averageRating in descending order before rendering
  albums = albums.sort((a, b) => b.averageRating - a.averageRating);

  if (albums && albums.length) {
    albums.forEach(album => {
      const row = `
        <tr>
            <td>${album.album}</td>
            <td>${album.releaseDate}</td>
            <td>${album.artistName}</td>
            <td>${album.genres}</td>
            <td>${album.averageRating}</td>
            <td>${album.numberRatings}</td>
        </tr>
      `;
      table.innerHTML += row;
    });
  } else {
    table.innerHTML = '<tr><td>No albums found matching the criteria.</td></tr>';
  }
}

