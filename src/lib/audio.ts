import { randomBetween } from "./util";

const audioPath = "/audio/";
type Sound =
    | "1.mp3"
    | "2.mp3"
    | "3.mp3"
    | "4.mp3"
    | "5.mp3"
    | "6.mp3"
    | "7.mp3"
    | "8.mp3";

/**
 * Plays a specified sound file at the given volume.
 * @param file - The sound file to play (one of the predefined Sound types).
 * @param volume - The volume level (0.0 to 1.0, default 0.25).
 * @param pitchRange - The range for randomizing pitch (default [0.9, 1.1]).
 */
export function playSound(
    file: Sound,
    volume: number = 0.25,
    pitchRange: [number, number] = [0.9, 1.1]
) {
    const audio = new Audio(audioPath + file);
    audio.volume = volume;
    audio.playbackRate = randomBetween(pitchRange[0], pitchRange[1]);
    audio.play().catch((error) => console.error("Error playing sound:", error));
}
