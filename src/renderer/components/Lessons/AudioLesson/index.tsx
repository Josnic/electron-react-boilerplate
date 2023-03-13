import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import AudioPlayer, {
    ActiveUI,
    InterfaceGridTemplateArea,
    PlayerPlacement,
    PlayListPlacement,
    ProgressUI,
    VolumeSliderPlacement
  } from "react-modern-audio-player";
import Artplayer from '../../ArtPlayer';
import ButtomCustom from '../../ButtonRound';

const AudioLesson = ({ data }) => {
    const [progressType, setProgressType] = useState<ProgressUI>("waveform");
    const [playerPlacement, setPlayerPlacement] = useState<PlayerPlacement>(
        "bottom-left"
    );
    const [interfacePlacement, setInterfacePlacement] = useState<
        InterfaceGridTemplateArea
    >();
    const [playListPlacement, setPlayListPlacement] = useState<PlayListPlacement>(
        "top"
    );
    const [volumeSliderPlacement, setVolumeSliderPlacement] = useState<
        VolumeSliderPlacement
    >();
    const [theme, setTheme] = useState<"dark" | "light" | undefined>();
    const [width, setWidth] = useState("100%");
    const [activeUI, setActiveUI] = useState<ActiveUI>({ all: true });


    const html = `lorem <b onmouseover="alert('mouseover');">ipsum  ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu mipsumipsumipsumipsu mipsumipsumips umipsumips umi psumv ipsum vv ipsum </b>`
    const sanitizedData = () => ({
        __html: DOMPurify.sanitize(html)
    })
    const playList = [
        {
          //name: 'name',
          //writer: 'writer',
          //img: "https://cdn.pixabay.com/photo/2022/08/28/18/03/dog-7417233__340.jpg",
          src: 'https://cdn.pixabay.com/audio/2022/08/23/audio_d16737dc28.mp3',
          id: 1,
        },
      ]
    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <div
                    dangerouslySetInnerHTML={sanitizedData()}
                />
            </Grid>
            <Grid item xs={12}>
                <AudioPlayer 
                    playList={playList} 
                    activeUI={{
                        ...activeUI,
                        progress: progressType
                      }}
                      placement={{
                       
                        interface: {
                          templateArea: interfacePlacement
                        },
                      
                        volumeSlider: volumeSliderPlacement
                      }}
                      rootContainerProps={{
                        colorScheme: theme,
                        width
                      }}    
                />
            </Grid>

            <Grid item xs={12} className='lessons-button-container-center'>
                <ButtomCustom variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    )
}

export default AudioLesson;