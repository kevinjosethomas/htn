import {
  HAND_CONNECTIONS,
  POSE_CONNECTIONS,
  FACEMESH_TESSELATION,
} from '@mediapipe/holistic';
import { YoutubeTranscript } from 'youtube-transcript';
import { drawConnectors } from '@mediapipe/drawing_utils';

let transcript;
const queue = [];
const BATCH_SIZE = 5;
const FETCH_AHEAD_TIME = 10;
let avatar, avatarContainer, currentSegment, word;

function decodeHTMLEntities(str) {
  const output = str
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  return output;
}

function fetchTranscript() {
  /* Fetch the transcript of the video */
  return YoutubeTranscript.fetchTranscript(window.location.href);
}

function addContainer() {
  /* Add a container to the sidebar for the avatar */

  avatarContainer = document.createElement('div');
  avatarContainer.id = 'avatar-container';
  avatar = document.createElement('canvas');
  avatar.id = 'avatar';
  avatarContainer.appendChild(avatar);
  word = document.createElement('p');
  word.id = 'word';
  avatarContainer.appendChild(word);

  const targetElement = document.getElementById('secondary-inner');
  if (targetElement) {
    targetElement.insertBefore(avatarContainer, targetElement.firstChild);
  }
}

function getCurrentTime() {
  /* Get current time of the video player */
  const player = document.querySelector('video');
  if (player) {
    return player.currentTime;
  }
  return 0;
}

function drawLandmarks(landmark, ctx) {
  if (landmark.pose_landmarks) {
    landmark.pose_landmarks.forEach((point) => {
      point.visibility = 1;
    });

    drawConnectors(ctx, landmark.pose_landmarks, POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2,
    });
  }

  if (landmark.face_landmarks) {
    landmark.face_landmarks.forEach((point) => {
      point.visibility = 1;
    });

    drawConnectors(ctx, landmark.face_landmarks, FACEMESH_TESSELATION, {
      color: '#00FF00',
      lineWidth: 0.5,
    });
  }

  if (landmark.right_hand_landmarks) {
    landmark.right_hand_landmarks.forEach((point) => {
      point.visibility = 1;
    });

    drawConnectors(ctx, landmark.right_hand_landmarks, HAND_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2,
    });
  }

  if (landmark.left_hand_landmarks) {
    landmark.left_hand_landmarks.forEach((point) => {
      point.visibility = 1;
    });

    drawConnectors(ctx, landmark.left_hand_landmarks, HAND_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 2,
    });
  }
}

function processQueue() {
  if (queue.length === 0) return;

  const batch = queue.splice(0, BATCH_SIZE);
  const promises = batch.map((segment) => {
    const words = segment.text;
    segment.loading = true;

    return fetch('http://127.0.0.1:5000/pose', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        words,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        segment.poses = data;
        segment.loading = false;
        return segment;
      });
  });

  Promise.all(promises).then((updatedBatch) => {
    updatedBatch.forEach((segment) => {
      const index = transcript.findIndex((s) => s === segment);
      transcript[index] = segment;
    });

    processQueue();
  });
}

function playAnimation(segment) {
  /* Play the animation of the avatar */
  const poses = segment.poses;

  if (!poses) {
    currentSegment = null;
    return;
  }
  if (!avatar) {
    currentSegment = null;
    return;
  }
  const ctx = avatar.getContext('2d');
  if (!ctx) {
    currentSegment = null;
    return;
  }

  const duration = segment.duration;
  const frames = poses.length;
  const fps = frames / duration;

  console.log(segment.text);

  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const currentFrame = Math.floor(elapsed * fps);

    if (currentFrame >= poses.length) {
      return;
    }

    const landmark = poses[currentFrame];
    const currentTime = getCurrentTime();

    if (
      currentTime >= segment.offset &&
      currentTime <= segment.offset + duration
    ) {
      word.innerText = landmark.word;
      ctx.clearRect(0, 0, avatar.width, avatar.height);
      drawLandmarks(landmark, ctx);
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function initializeExtension() {
  if (avatar || avatarContainer) {
    avatar.remove();
    avatarContainer.remove();
  }

  addContainer();
  fetchTranscript().then((data) => {
    transcript = data.map((x) => ({
      ...x,
      text: decodeHTMLEntities(x.text),
    }));
    console.log(transcript);
    queue.push(...transcript);
    processQueue();
  });

  setInterval(() => {
    if (!transcript) return;

    const time = getCurrentTime();
    const nextSegment = transcript.find(
      (segment) =>
        !segment.poses &&
        !segment.loading &&
        segment.offset < time + FETCH_AHEAD_TIME
    );

    if (nextSegment && queue.length > 0) {
      processQueue();
    }
  }, 500);

  setInterval(() => {
    const currentTime = getCurrentTime();

    if (!transcript) return;
    if (
      currentSegment &&
      currentSegment.offset < currentTime &&
      currentSegment.offset + currentSegment.duration > currentTime
    )
      return;

    currentSegment = transcript.find(
      (segment) =>
        segment.offset <= currentTime &&
        segment.offset + segment.duration >= currentTime
    );

    if (currentSegment) {
      playAnimation(currentSegment);
    }
  }, [200]);

  setTimeout(() => {
    const targetElement = document.getElementById('secondary-inner');
    if (targetElement) {
      addContainer();
    }
  }, 1500);
}

function observeUrlChanges() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      location.reload();
    }
  }).observe(document, { subtree: true, childList: true });
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const videoElement = document.querySelector('video');
    if (videoElement) {
      videoElement.pause();
    }
  },
  [200]
);

initializeExtension();
observeUrlChanges();
