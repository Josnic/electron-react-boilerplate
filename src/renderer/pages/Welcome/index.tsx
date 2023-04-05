import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

import ButtomCustom from '../../components/ButtonRound';
import Artplayer from '../../components/ArtPlayer';


export default function Welcome() {
    const navigate = useNavigate();
    const goToLogin = () =>{
        navigate("/login")
    }
    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <Artplayer
                    option={{
                        url: 'https://artplayer.org/assets/sample/video.mp4',
                        setting: true,
                        autoSize: true,
                        autoMini: true,
                        screenshot: true,
                        setting: true,
                        loop: true,
                        flip: true,
                        playbackRate: true,
                        aspectRatio: true,
                        fullscreen: true,
                        fullscreenWeb: true,
                        miniProgressBar: true,
                        mutex: true,
                        backdrop: true,
                        playsInline: true,
                        autoPlayback: true,
                        airplay: true,
                        theme: '#23ade5',
                        lang: 'es',
                        whitelist: ['*'],
                        moreVideoAttr: {
                            crossOrigin: 'anonymous',
                        }
                    }}
                    style={{
                        maxWidth: '800px',
                        height: '600px',
                        margin: 'auto'
                    }}
                    getInstance={(art) => console.info(art)}
                />
            </Grid>

            <Grid item xs={12} className='lessons-button-container-center'>
                <ButtomCustom onClick={goToLogin} variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    );
}