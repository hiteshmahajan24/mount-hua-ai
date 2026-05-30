const STORAGE_KEY =
  "mount_hua_progress";

// ======================================
// LOAD ALL
// ======================================

export function getProgressMap() {

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : {};

}

// ======================================
// SAVE ONE CHAPTER
// ======================================

export function saveProgress(

  chapter,

  currentTime,

  duration

) {

  if (!duration)
    return;

  const progressMap =
    getProgressMap();

  progressMap[chapter] = {

    time:
      currentTime,

    duration,

    progress:
      Math.floor(
        (
          currentTime
          /
          duration
        ) * 100
      ),

    updatedAt:
      Date.now()

  };

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(
      progressMap
    )

  );

}

// ======================================
// GET CHAPTER
// ======================================

export function getChapterProgress(
  chapter
) {

  const progressMap =
    getProgressMap();

  return (

    progressMap[
      chapter
    ]

    ||

    null

  );

}

// ======================================
// CONTINUE WATCHING
// ======================================

export function getContinueWatching() {

  const progressMap =
    getProgressMap();

  return Object.entries(
    progressMap
  )

  .map(([chapter, data]) => ({

    chapter:
      Number(chapter),

    ...data

  }))

  .sort(
    (a, b) =>

      b.updatedAt -
      a.updatedAt

  )

  .slice(0, 10);

}