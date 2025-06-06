import { IconButton, styled } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import { Fullscreen, FullscreenExit, Loop, Pause } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectMediaFiles } from "ui/plocs/media_files/selectors";
import { changeAudio, changeSubtitles, fullscreen, loop, pause, subscribeToPlayback, unsubscribeToPlayback } from "ui/plocs/playback/actions";
import { selectAudioId, selectFullscreen, selectLoopVariant, selectMediaFilePath, selectPaused, selectSubtitleId } from "ui/plocs/playback/selectors";
import { LoopVariant } from "ui/plocs/playback/models";
import { AudioSubtitleDialog } from "ui/pages/playback/components/AudioSubtitleDialog";
import { Progress } from "ui/pages/playback/components/Progress";
import { LoopDialog } from "ui/pages/playback/components/LoopDialog";
import { selectConnected } from "ui/plocs/connection/selectors";
import { PlaybackPath } from "ui/common/components/PlaybackPath";
import { focusOnMediaFile } from "ui/plocs/media_files/actions";

type Props = {
  onMenuClick: () => void
};

export const PlaybackSummary = (props: Props) => {
  const [loopDialogOpen, setLoopDialogOpen] = useState<boolean>(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState<boolean>(false);

  const connected = useSelector(selectConnected);

  const mediaFiles = useSelector(selectMediaFiles);
  
  const playbackMediaFilePath = useSelector(selectMediaFilePath);
  const playbackPaused = useSelector(selectPaused);
  const playbackFullscreen = useSelector(selectFullscreen);
  const currentSubtitleId = useSelector(selectSubtitleId);
  const currentAudioId = useSelector(selectAudioId);
  const currentLoopVariant = useSelector(selectLoopVariant);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!connected) return;

    dispatch(subscribeToPlayback());
  
    return () => {
      dispatch(unsubscribeToPlayback());
    };
  }, [connected, dispatch]);

  const currentMediaFile = useMemo(() => {
    if (!playbackMediaFilePath) return undefined;

    return mediaFiles[playbackMediaFilePath];
  }, [playbackMediaFilePath, mediaFiles]);

  const togglePlayback = useCallback(() => {
    dispatch(pause(!playbackPaused));
  }, [dispatch, playbackPaused]);

  const toggleFullscreen = useCallback(() => {
    dispatch(fullscreen(!playbackFullscreen));
  }, [dispatch, playbackFullscreen]);

  const onLanguageChange = useCallback((args: { subtitleId?: string, audioId?: string }) => {
    if (args.subtitleId && args.subtitleId !== currentSubtitleId) dispatch(changeSubtitles(args.subtitleId));
    if (args.audioId && args.audioId !== currentAudioId) dispatch(changeAudio(args.audioId));
    setLanguageDialogOpen(false); 
  }, [currentSubtitleId, dispatch, currentAudioId]);

  const onLoopChange = useCallback((variant: LoopVariant) => {
    dispatch(loop(variant));
    setLoopDialogOpen(false); 
  }, [dispatch]);

  const mediaFileSelected = useMemo(() => {
    return !!playbackMediaFilePath;
  }, [playbackMediaFilePath]);

  const onPlaybackPathClick = useCallback(() => {
    if (!playbackMediaFilePath) return;

    dispatch(focusOnMediaFile(playbackMediaFilePath));
  }, [dispatch, playbackMediaFilePath])

  return (
    <ThemedContainer>
      <SectionsContainer>
        <PlaybackControlButton disabled={!connected} onClick={props.onMenuClick}>
          <MenuIcon />
        </PlaybackControlButton>
        <PlaybackContainer>
          <PlaybackPathContainer
            onClick={onPlaybackPathClick}
            path={playbackMediaFilePath}
          />
          <Progress/>
          <ButtonsContainer>
            <PlaybackControlButton
              aria-label="playChange"
              onClick={togglePlayback}
              disabled={!mediaFileSelected}
              title={playbackPaused ? 'Play' : 'Pause'}
            >
              {
                playbackPaused
                  ? <PlayArrowIcon />
                  : <Pause />
              }
            </PlaybackControlButton>
            <PlaybackControlButton
              aria-label="fullscreen"
              onClick={toggleFullscreen}
              disabled={!mediaFileSelected}
              title={playbackFullscreen ? 'Go fullscreen' : 'Exit fullscreen'}
            >
              {
                playbackFullscreen
                  ? <FullscreenExit/>
                  : <Fullscreen/>
              }
            </PlaybackControlButton>
            <PlaybackControlButton
              aria-label="loop"
              onClick={() => setLoopDialogOpen(true)}
              disabled={!mediaFileSelected}
              title='Change loop options'
            >
              <Loop />
            </PlaybackControlButton>
            <PlaybackControlButton
              aria-label="language"
              onClick={() => setLanguageDialogOpen(true)}
              disabled={!mediaFileSelected}
              title='Audio & Video language'
            >
              <LanguageIcon />
            </PlaybackControlButton>
            <LoopDialog
              currentVariant={currentLoopVariant ?? LoopVariant.Off}
              open={loopDialogOpen}
              onOk={onLoopChange}
              onClose={() => setLoopDialogOpen(false)}
            />
            <AudioSubtitleDialog
              mediaFile={currentMediaFile}
              currentSubtitleId={currentSubtitleId}
              currentAudioId={currentAudioId}
              open={languageDialogOpen}
              onOk={onLanguageChange}
              onClose={() => setLanguageDialogOpen(false)}
            />
          </ButtonsContainer>
        </PlaybackContainer>
      </SectionsContainer>
    </ThemedContainer>
  );
};

const SectionsContainer = styled('div')(({
  display: 'flex',
  flexDirection: 'row',
  gap: '15px',
  flexGrow: 1,
  alignItems: 'center',
}));

const PlaybackContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  overflow-x: hidden;
  padding: 0 10px 0 10px;
`;

const PlaybackPathContainer = styled(PlaybackPath)`
  font-weight: bold;
  text-align: center;
`;

const ButtonsContainer = styled('div')(({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}))

const ThemedContainer = styled('div')(({ theme}) => {
  return {
    color: theme.palette.primary.contrastText
  };
});

const PlaybackControlButton = styled(IconButton)(({ theme }) => {
  return {
    color: theme.palette.primary.contrastText
  };
});
