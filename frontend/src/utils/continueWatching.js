const STORAGE_KEY = "mount_hua_continue";

export function getContinueWatching() {

  const data = localStorage.getItem(
    STORAGE_KEY
  );

  return data
    ? JSON.parse(data)
    : [];

}

export function saveContinueWatching(entry) {

  const existing =
    getContinueWatching();

  const filtered =
    existing.filter(

      (item) =>

        item.chapter !==
        entry.chapter

    );

  const updated = [

    {
      ...entry,

      updatedAt:
        Date.now()

    },

    ...filtered

  ]

  .sort(
    (a, b) =>
      b.updatedAt - a.updatedAt
  )

  .slice(0, 3);

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(updated)

  );

}