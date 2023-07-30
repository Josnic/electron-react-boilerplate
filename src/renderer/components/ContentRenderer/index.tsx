import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Artplayer from '../ArtPlayer';
import AudioPlayer, {
  ActiveUI,
  InterfaceGridTemplateArea,
  PlayerPlacement,
  PlayListPlacement,
  ProgressUI,
  VolumeSliderPlacement,
} from 'react-modern-audio-player';
import ButtomCustom from '../ButtonRound';
import parse from 'html-react-parser';
import * as download from 'downloadjs/download';
import { useSelector } from 'react-redux';
import { getMysqlDate } from '../../utils/generals';
import { getPathCourseResource } from '../../utils/electronFunctions';
import { useStateWithCallback } from '../../hooks/useStateWithCallback';
import { sqlite3Run } from '../../helpers/Sqlite3Operations';
import './styles.scss';

const Audio = ({ playList }) => {
  const [progressType, setProgressType] = useState<ProgressUI>('waveform');
  const [playerPlacement, setPlayerPlacement] =
    useState<PlayerPlacement>('bottom-left');
  const [interfacePlacement, setInterfacePlacement] =
    useState<InterfaceGridTemplateArea>();
  const [playListPlacement, setPlayListPlacement] =
    useState<PlayListPlacement>('top');
  const [volumeSliderPlacement, setVolumeSliderPlacement] =
    useState<VolumeSliderPlacement>();
  const [theme, setTheme] = useState<'dark' | 'light' | undefined>();
  const [width, setWidth] = useState('100%');
  const [activeUI, setActiveUI] = useState<ActiveUI>({ all: true });

  return (
    <>
      <AudioPlayer
        playList={playList}
        activeUI={{
          ...activeUI,
          progress: progressType,
        }}
        placement={{
          interface: {
            templateArea: interfacePlacement,
          },

          volumeSlider: volumeSliderPlacement,
        }}
        rootContainerProps={{
          colorScheme: theme,
          width,
        }}
      />
    </>
  );
};

const Video = ({ source, getInstance }) => {
  return (
    <div>
      <Artplayer
        option={{
          url: source,
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
          },
        }}
        style={{
          maxWidth: '600px',
          height: '400px',
          margin: 'auto',
        }}
        getInstance={(art) => {
          getInstance(art)
          console.info(art)
        }}
      />
    </div>
  );
};

const ContentRenderer = ({ data, type, courseCode, onContinue }) => {
  const [html, setHtml] = useState(null);
  const [filePathDownload, setFilePathDownload] = useState(null);
  const [rootMultimedia, setRootMultimedia] = useStateWithCallback([]);
  const [artPlayerInstances, setArtPlayerInstances] = useState([]);
  const authState = useSelector((state) => state);
  const prepareHtml = async () => {
    setFilePathDownload(null);
    let path = courseCode;
    let content = data.contenido;
    let content2 = "";
    //imagenes
    const images = data.imagenes ? data.imagenes.split(',') : null;
    if (Array.isArray(images)) {
      for (let i = 0; i < images.length; i++) {
        let finalPath = '';
        if (images[i].indexOf("commons/") != -1){
          finalPath = await getPathCourseResource(
            images[i].replace("commons", "commons.asar")
          );
        }else{
          finalPath = await getPathCourseResource(
            path + '/img.asar/' + images[i]
          );
        }
        if (content){
          content = content.replace(images[i], finalPath);
        }else{
          content2 += "<img src='"+finalPath+"' />"
        }
      }
    }
    //interactivos 
    const interactives = data.interactivos ? data.interactivos.split(',') : null;
    
    if (Array.isArray(interactives)) {
      for (let i = 0; i < interactives.length; i++) {
        const finalPath = await getPathCourseResource(
          path + '/interactivos/' + data.cod_unidad + ".asar/" + interactives[i]
        );
        if (content){
          content = content.replace(interactives[i], finalPath + "/index.html");
        }else{
          content2 += '<iframe style="max-width: 100%; width: 773px; height: 434px;" rte-for="insertvideo" border="0" allowfullscreen="" src="'+finalPath + "/index.html"+'"></iframe>'
        }
      }
    }

    //videos 
    if (!content){
      const videos = data.videos ? data.videos.split(',') : null;
      const audios = data.audios ? data.audios.split(',') : null;
      let path = courseCode;
      if (Array.isArray(videos)) {
        for (let i = 0; i < videos.length; i++) {
          content2 += "<div id='"+videos[i]+"'></div>"
        }
      }

      if (Array.isArray(audios)) {
        for (let i = 0; i < audios.length; i++) {
          content2 += "<div id='"+audios[i]+"'></div>"
        }
      }
    }

    if (data.archivo_descargable) {
      const filePathPdf = await getPathCourseResource(
        path + '/pdf.asar/' + data.archivo_descargable
      );
      setFilePathDownload(filePathPdf);
    }

    const finalHtml = content ? content : content2;
    if (finalHtml){
      if (rootMultimedia.length > 0){
        if(artPlayerInstances.length > 0) {
          for (let k = 0; k < artPlayerInstances.length; k++){
            artPlayerInstances[k].destroy();
          }
        }
        for (let i = 0; i < rootMultimedia.length; i++){
          try{
            rootMultimedia[i].unmount();
          }catch(e){
            console.log(e)
          }
          
        }
        setRootMultimedia([], (prevValue, newValue) => {
          console.log(newValue);
          setArtPlayerInstances([]);
          setHtml(finalHtml);
        })
      }else{
        setHtml(finalHtml);
      }
    }else{
      setHtml(null);
    }
  };

  const renderMultimediaComponents = async () => {
    const videos = data.videos ? data.videos.split(',') : null;
    const audios = data.audios ? data.audios.split(',') : null;
    let path = courseCode;
    if (Array.isArray(videos)) {
      for (let i = 0; i < videos.length; i++) {
        const finalPath = await getPathCourseResource(
          path + '/videos/' + data.cod_unidad + ".asar/" + videos[i]
        );
        await renderMultimedia(videos[i], 'VIDEO', finalPath, data.nombre);
      }
    }

    if (Array.isArray(audios)) {
      for (let i = 0; i < audios.length; i++) {
        const finalPath = await getPathCourseResource(
          path + '/audios.asar/' + audios[i]
        );
        await renderMultimedia(audios[i], 'AUDIO', finalPath, data.nombre);
      }
    }
  };

  const renderMultimedia = (identifier, type, source, name) => {
    const container = document.getElementById(identifier);
    if (container.innerHTML) {
      container.innerHTML = container.innerHTML.trim();
    }
    const root = createRoot(container);
    setRootMultimedia(Array.from(rootMultimedia).concat([root]), (prevValue, newValue) => {
      console.log(newValue);
    })
    let component = null;
    switch (type) {
      case 'AUDIO':
        const playList = [
          {
            name: name,
            //writer: 'writer',
            //img: '',
            src: source,
            id: 1,
          },
        ];
        component = <Audio playList={playList} />;
      break;

      case 'VIDEO':
        component = <Video source={source} getInstance={(artInstance)=>{
          setArtPlayerInstances(artPlayerInstances => [...artPlayerInstances, artInstance])
        }} />;
      break;
    }

    root.render(component);
  };

  const insertView = async() => {
    if(type == "SUBLESSON"){
      const userId = authState && authState.user ? authState.user.email : "test";
      const result = await sqlite3Run(
        "INSERT INTO sublecciones_vistas VALUES (?,?,?)", 
        [userId, data.id, getMysqlDate()]
      );
    }
  }

  useEffect(() => {
    prepareHtml();
    insertView();
  }, [data]);

  useEffect(() => {
    if (html) {
      renderMultimediaComponents();
      document.getElementsByClassName("main")[0].scrollTo({ top: 0, left: 0 });
    }
  }, [html]);


  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <Grid item xs={12}>
        {html ? <div className="mt-content">{parse(html)}</div> : null}
      </Grid>
      {
        data && filePathDownload  ? (
          <Grid item xs={12} className="download-button-container">
            <Button onClick={()=>{
              download(filePathDownload);
            }} variant="outlined" download>{data.texto_boton}</Button>
          </Grid>
        ):(
          null
        )
      }
      {
        type == "SUBLESSON" ? (
          <Grid item xs={12} className="lessons-button-container-center">
            <ButtomCustom onClick={()=>{
              onContinue();
            }} variant="contained" rounded>
              Continuar
            </ButtomCustom>
          </Grid>
        ):(
          null
        )
      }
    </Grid>
  );
};

export default ContentRenderer;
