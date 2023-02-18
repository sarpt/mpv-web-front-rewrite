import { LoopVariant } from "../../delivery/ui/plocs/playback/models";
import { Playback } from "./entities";

export interface PlaybackRepository {
  changeAudio(audioId: string): Promise<void>,
  changeSubtitles(subtitlesId: string): Promise<void>,
  fetchPlayback(): Promise<Playback | undefined>,
  playMediaFile(path: string, append?: boolean): Promise<void>,
  setPause(paused: boolean): Promise<void>,
  setFullscreen(enabled: boolean): Promise<void>,
  setLoopFile(variant: LoopVariant): Promise<void>,
}
