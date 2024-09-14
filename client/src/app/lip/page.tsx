"use client";

import axios from "axios";
import { useState } from "react";

import Avatar from "./components/Avatar";
import LipReader from "./components/LipReader";

export default function LipPage() {
  const [transcript, setTranscript] = useState<string>("");
  const [poses, setPoses] = useState<any[]>([]);

  async function fetchTranscript(blob: Blob) {
    const formData = new FormData();
    formData.append("video", blob, "lipsync-video.mp4");

    try {
      const response = await axios.post(
        "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscript(response.data);
      await fetchPoses(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchPoses(words: string) {
    const poseResponse = await axios.post("http://127.0.0.1:5000/pose", {
      words: words,
    });
    const landmarks = poseResponse.data;
    setPoses(landmarks);
  }

  return (
    <div className="w-screen h-screen grid grid-cols-2 bg-black">
      <LipReader transcript={transcript} fetchTranscript={fetchTranscript} />
      <Avatar poses={poses} />
    </div>
  );
}
