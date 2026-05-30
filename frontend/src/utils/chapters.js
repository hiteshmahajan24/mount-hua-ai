const API =
  `http://${window.location.hostname}:8000`;

export async function loadChapters() {

  const res =
    await fetch(
      `${API}/chapters`
    );

  return res.json();

}