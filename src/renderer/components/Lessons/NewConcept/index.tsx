import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import Artplayer from '../../ArtPlayer';
import ButtomCustom from '../../ButtonRound';
import './styles.scss';

const NewConcept = ({ data }) => {

    const html = `lorem <b onmouseover="alert('mouseover');">ipsum  ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu ipsumipsumipsumipsumipsu mipsumipsumipsumipsu mipsumipsumips umipsumips umi psumv ipsum vv ipsum </b>`
    const sanitizedData = () => ({
        __html: DOMPurify.sanitize(html)
    })
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
                        maxWidth: '600px',
                        height: '400px',
                        margin: 'auto'
                    }}
                    getInstance={(art) => console.info(art)}
                />
            </Grid>
            <Grid item xs={12}>
                <div
                    dangerouslySetInnerHTML={sanitizedData()}
                />
            </Grid>

            <Grid item xs={12} className='button-container'>
                <ButtomCustom variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    )
}

export default NewConcept;