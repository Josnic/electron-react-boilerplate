import * as React from 'react';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

import ButtomCustom from '../../components/ButtonRound';
import Artplayer from '../../components/ArtPlayer';
import { getPathCourseResource } from '../../utils/electronFunctions';

export default function Welcome() {
  const navigate = useNavigate();
  const goToLogin = () => {
    navigate('/login');
  };
  const [urlVideo, setUrlVideo] = React.useState(null);

  const getUrlVideo = async() => {
    const video = await getPathCourseResource('commonassets/bienvenida.mp4');
    setUrlVideo(video);
  }

  React.useEffect(()=>{
    getUrlVideo();
  }, [])
  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        {urlVideo ? (
          <Artplayer
            option={{
              url: urlVideo,
              setting: true,
              autoplay: true,
              autoSize: true,
              autoMini: true,
              screenshot: true,
              setting: true,
              loop: false,
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
              },
            }}
            style={{
              maxWidth: '800px',
              height: '600px',
              margin: 'auto',
            }}
            getInstance={(art) => console.info(art)}
          />
        ) : null}
      </Grid>

      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom onClick={goToLogin} variant="contained" rounded>
          Continuar
        </ButtomCustom>
      </Grid>
    </Grid>
  );
}
