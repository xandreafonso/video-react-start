"use client";

import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";


const videoSources: any = {
  low:    'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/240/Big_Buck_Bunny_240_10s_1MB.mp4',
  medium: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
  high:   'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState("medium");
  const [isSeeking, setIsSeeking] = useState(false);

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopVideo = () => {
    if (!videoRef.current) return;

    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = parseFloat(event.target.value);
    setPlaybackRate(videoRef.current.playbackRate);
  };

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!videoRef.current) return;

    const newQuality = event.target.value;
    setQuality(newQuality);

    const currentTime = videoRef.current.currentTime;
    const isPlaying = !videoRef.current.paused;
    const speed = videoRef.current.playbackRate;

    videoRef.current.src = videoSources[newQuality];
    videoRef.current.currentTime = currentTime;
    videoRef.current.playbackRate = speed;

    setQuality(newQuality);
    if (isPlaying) videoRef.current.play();
  };

  const handleProgress = () => {
    if (!videoRef.current) return;

    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;

    setProgress(progress);
  };

  const handleProgressBarChange = (
    event:
      | React.MouseEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    if (!videoRef.current) return;

    const newTime =
      (parseFloat((event.target as HTMLInputElement).value) / 100) *
      videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(parseFloat((event.target as HTMLInputElement).value));
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeekEnd = (
    event:
      | React.MouseEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    setIsSeeking(false);
    handleProgressBarChange(event);
  };

  const handleSeekMove = (
    event:
      | React.MouseEvent<HTMLInputElement>
      | React.TouchEvent<HTMLInputElement>
  ) => {
    if (isSeeking) {
      handleProgressBarChange(event);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    video.addEventListener("timeupdate", handleProgress);

    return () => {
      video.removeEventListener("timeupdate", handleProgress);
    };
  }, []);

  return (
    <main className="h-full flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center w-3/5">
        <video
          ref={videoRef}
          onClick={togglePlayPause}
          className="aspect-video w-full"
        >
          <source src={videoSources[quality]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressBarChange}
          onMouseDown={handleSeekStart}
          onMouseUp={handleSeekEnd}
          onMouseMove={handleSeekMove}
          onTouchStart={handleSeekStart}
          onTouchEnd={handleSeekEnd}
          onTouchMove={handleSeekMove}
          className="range range-primary w-3/5"
        />

        <div className="flex gap-4 items-center justify-center">
          <button onClick={togglePlayPause} className="btn">
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button onClick={stopVideo} className="btn">
            Stop
          </button>

          <select
            value={playbackRate}
            onChange={handleSpeedChange}
            className="select select-bordered"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>

          <select
            id="quality"
            value={quality}
            onChange={handleQualityChange}
            className="select select-bordered"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
    </main>
  );
}
