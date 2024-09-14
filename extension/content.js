let transcript;
let avatar, avatarContainer;
const queue = [];
const BATCH_SIZE = 5;
const FETCH_AHEAD_TIME = 60;

fetchTranscript().then((data) => {
  transcript =
    data.actions[0].updateEngagementPanelAction.content.transcriptRenderer
      .content.transcriptSearchPanelRenderer.body.transcriptSegmentListRenderer
      .initialSegments;

  transcript = transcript.map((segment) => segment.transcriptSegmentRenderer);
  queue.push(...transcript);

  processQueue();
});

function processQueue() {
  if (queue.length === 0) return;

  const batch = queue.splice(0, BATCH_SIZE);

  const promises = batch.map((segment) => {
    const words = segment.snippet.runs[0].text;

    return fetch("http://127.0.0.1:5000/pose", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        words,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        segment.poses = data;
        return segment;
      });
  });

  Promise.all(promises).then((updatedBatch) => {
    updatedBatch.forEach((segment) => {
      const index = transcript.findIndex((s) => s === segment);
      transcript[index] = segment;
    });

    console.log(transcript);

    processQueue();
  });
}

setInterval(() => {
  const time = getCurrentTime();

  const nextSegmentTime = transcript.find(
    (segment) => segment.startTime > time / 1000 + FETCH_AHEAD_TIME
  );

  if (nextSegmentTime && queue.length > 0) {
    processQueue();
  }
}, 500);

const observer = new MutationObserver((mutations, obs) => {
  const targetElement = document.getElementById("secondary-inner");
  if (targetElement) {
    addContainer();
    obs.disconnect();
  }
});
