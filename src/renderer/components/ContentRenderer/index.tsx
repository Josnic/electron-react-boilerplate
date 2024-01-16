import React, { useEffect, useRef, useState } from 'react';
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
import ResponsiveIframe from '../ResponsiveIframe';
import OverlayLoader from '../OverlayLoader';
import parse from 'html-react-parser';
import * as download from 'downloadjs/download';
import { useSelector } from 'react-redux';
import { getMysqlDate } from '../../utils/generals';
import { getPathCourseResource, getBinaryContent } from '../../utils/electronFunctions';
import { useStateWithCallback } from '../../hooks/useStateWithCallback';
import { sqlite3Run, sqlite3All } from '../../helpers/Sqlite3Operations';
import { getMimeType } from '../../utils/generals';
import { useInterval } from '../../hooks/useInterval'
import './styles.scss';

const Audio = ({ playList, getInstance }) => {
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

  const audioRef = useRef();

  useEffect(()=>{
    if (audioRef.current) {
      getInstance(audioRef.current)
    }
  }, [audioRef.current])

  return (
    <>
      <AudioPlayer
        playList={playList}
        activeUI={{
          ...activeUI,
          progress: progressType,
        }}
        audioRef={audioRef}
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
          id: source,
          url: source,
          setting: true,
          autoSize: true,
          autoMini: true,
          screenshot: true,
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
          maxWidth: '600px',
          height: '400px',
          margin: 'auto',
        }}
        getInstance={(art) => {
          getInstance(art)
        }}
      />
    </div>
  );
};

const ContentRenderer = ({ data, type, courseCode, onFinalize, onContinue }) => {
  const [html, setHtml] = useState(null);
  const [open, setOpen] = useState(false);
  const [filePathDownload, setFilePathDownload] = useState(null);
  const [rootMultimedia, setRootMultimedia] = useStateWithCallback([]);
  const [artPlayerInstances, setArtPlayerInstances] = useState([]);
  const [audiosInstances, setAudiosInstances] = useState([]);
  const authState = useSelector((state) => state);
  const videosDuration = useRef(0);
  const audiosDuration = useRef(0);
  const DEFAULT_DURATION_SUBLESSONS_SECONDS = 30;
  const sublessonDuration = useRef(DEFAULT_DURATION_SUBLESSONS_SECONDS);
  const MAX_DURATION_VIDEOS_PERCENTAGE = 50;
  const MAX_DURATION_AUDIOS_PERCENTAGE = 50;

  const [count, setCount] = useState(0) 
  const [delay, setDelay] = useState(1000) 
  const [isPlaying, setPlaying] = useState(false)
  const durationFromDB = useRef(false)
  const isQuizFinalized = useRef(true);
  const [isSaved, setIsSaved] = useState(false)


  useInterval( 
    () => { 
      setCount(count + 1) 
    },  
    isPlaying && !isSaved ? delay : null, 
  ) 

  const prepareHtml = async () => {
    setFilePathDownload(null);
    let path = courseCode;
    let content = data.contenido;
    let content2 = "";
    sublessonDuration.current = DEFAULT_DURATION_SUBLESSONS_SECONDS;
    if (data.duracion_minima_segundos != null && Number(data.duracion_minima_segundos)){
      sublessonDuration.current = Number(data.duracion_minima_segundos);
      durationFromDB.current = true;
    }
     
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
        //let regex = /\n*\s*<iframe.*?\\?>.*?<\/iframe\\?>\s*\n*/gi;
        let regex = /\n*\s*<iframe.*?\\?>.*?<\/iframe\\?>\s*\n*/;
        if (content){
          content = content.replace(regex, "<div id='iframe_"+interactives[i]+"'></div>");
        }else{
          content2 += "<div id='iframe_"+interactives[i]+"'></div>"
        }
      }
    }
 
    if (!content){
      const videos = data.videos ? data.videos.split(',') : null;
      const audios = data.audios ? data.audios.split(',') : null;
      const iframe = data.interactivos ? data.interactivos.split(',') : null;
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

      if (Array.isArray(iframe)) {
        for (let i = 0; i < iframe.length; i++) {
          content2 += "<div id='iframe_"+iframe[i]+"'></div>"
        }
      }
    }

    if (data.archivo_descargable) {

      const arrayDownloadableFilesNames = data.archivo_descargable.split(",");
      const arrayDownloadableFilesButtonTexts = data.texto_boton.split(",");

      let newArrayFilesData = [];

      for (let k = 0; k < arrayDownloadableFilesNames.length; k++) {
        const extensionFile = arrayDownloadableFilesNames[k].split(".").pop();
        newArrayFilesData.push({
          file: path + '/descargables.asar/' + arrayDownloadableFilesNames[k],
          buttonText: arrayDownloadableFilesButtonTexts[k] ? arrayDownloadableFilesButtonTexts[k] : "Descarga fichero " + extensionFile.toUpperCase() 
        })
      }

      setFilePathDownload(newArrayFilesData);
    }

    const finalHtml = content ? content : content2;
    if (finalHtml){
      if (rootMultimedia.length > 0){
        if(artPlayerInstances.length > 0) {
          for (let k = 0; k < artPlayerInstances.length; k++){
            artPlayerInstances[k].destroy();
          }
        }

        if(audiosInstances.length > 0) {
          for (let k = 0; k < audiosInstances.length; k++){
            audiosInstances[k] = null;
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
    const iframe = data.interactivos ? data.interactivos.split(',') : null;
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
        console.log(finalPath)
        await renderMultimedia(audios[i], 'AUDIO', finalPath, data.nombre);
      }
    }

    if (Array.isArray(iframe)) {
      for (let i = 0; i < iframe.length; i++){
        const finalPath = await getPathCourseResource(
          path + '/interactivos/' + data.cod_unidad + ".asar/" + iframe[i]  + "/index.html"
        );
        await renderMultimedia("iframe_" + iframe[i], 'IFRAME', finalPath, data.nombre);
      }
    }
  };

  const updateIsPlayingValue = (value) => {
    setPlaying(value)
  }

  const updateVideosDuration = (value) => {
   videosDuration.current = videosDuration.current + value;
  }

  const renderMultimedia = (identifier, type, source, name) => {
    const container = document.getElementById(identifier);
    if (container && container.innerHTML) {
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
            id: 1
          },
        ];
        component = <Audio playList={playList} getInstance={(audioInstance)=>{
          
          audioInstance.id = identifier + "_audio";
          const audioElement = document.getElementById(audioInstance.id)
          audioElement.onplay = function() {
            const isSaved1 = document.getElementById("input-hidden-saved").value == "true";
            if (!isSaved1) {
              updateIsPlayingValue(true);
            }
          };
          audioElement.onpause = function() {
            updateIsPlayingValue(false);
          };

          audioElement.onloadeddata = function () {
            console.log(audioElement.duration)
            audiosDuration.current = audiosDuration.current + audioElement.duration
          }

          setAudiosInstances(audiosInstances => [...audiosInstances, audioInstance])

         }} />;
      break;

      case 'VIDEO':
        component = <Video source={source} getInstance={(artInstance)=>{

          artInstance.on('video:canplay', (...args) => {
            if (data.duracion_minima_segundos == null) {
              const el = document.querySelector('[data-art-id="'+artInstance.id+'"]');
              const video = el.querySelector("video");
              updateVideosDuration(video.duration);
              
              /*video.onplay = () => {
                const isSaved1 = document.getElementById("input-hidden-saved").value == "true";
                if (!isSaved1){
                  updateIsPlayingValue(true);
                }
              }
              video.onpause = () => {
                updateIsPlayingValue(false);
              }*/
            
            }
          });

          artInstance.on('video:play', (...args) => {

            const isSaved1 = document.getElementById("input-hidden-saved").value == "true";
            if (!isSaved1){
              updateIsPlayingValue(true);
            }
          });
          artInstance.on('video:pause', (...args) => {

              updateIsPlayingValue(false);
            
          });
          

          artInstance.on("video:timeupdate", (...args) => {
            console.log(artInstance.currentTime)
            const isSaved2 = document.getElementById("input-hidden-saved").value == "true";
            const isPlaying2 = document.getElementById("input-hidden-is-playing").value == "true";
            if (!isPlaying2 && !isSaved2) {
              updateIsPlayingValue(true);
            }
          });

          setArtPlayerInstances(artPlayerInstances => [...artPlayerInstances, artInstance])
        }} />;
      break;

      case 'IFRAME':
        component = <ResponsiveIframe id={identifier} sourceUrl={source} title={""} callbackSave={()=>{
          if (isQuizFinalized.current == false){
            isQuizFinalized.current = true;
            setPlaying(false);
            setCount(0);
            insertView()
          }
        }} />
      break;
    }

    root.render(component);
  };

  const insertView = async() => {
    if(type == "SUBLESSON"){
      console.log("guardando...")
      const userId = authState && authState.auth.user ? authState.auth.user.email : "test";

      const validate = await sqlite3All(`SELECT * FROM sublecciones_vistas WHERE user_id = '${userId}' AND subleccion_id = '${data.id}'`)
      console.log(validate.OK.length)
      if (validate.OK){
        if (validate.OK.length > 0){
          const result = await sqlite3Run(
            `UPDATE sublecciones_vistas SET num_vista = num_vista + 1, ultima_fecha = '${getMysqlDate()}' WHERE user_id = '${userId}' AND subleccion_id = '${data.id}'`, 
            []
          );
          console.log(result)
        }else{
          const result = await sqlite3Run(
            "INSERT INTO sublecciones_vistas VALUES (?,?,?,?)", 
            [userId, data.id, getMysqlDate(), 1]
          );
          console.log(result)
        }
        setIsSaved(true);
        onFinalize();
      }
    }
  }

  const downloadFile = async(filePath) => {
    const fileBytes = await getBinaryContent(filePath);
    const filePathAr = filePath.split("/");
    const fileName =  filePathAr[filePathAr.length - 1];
    const extension = filePathAr[filePathAr.length - 1].split(".").pop();
    download(fileBytes, fileName, getMimeType(extension));
  }

  useEffect(() => {
    setOpen(true);
    if (data && data.tipo && data.tipo == "EV") {
      isQuizFinalized.current = false;
    }else{
      isQuizFinalized.current = true;
    }
    durationFromDB.current = false;
    prepareHtml();
    setOpen(false);
  }, [data]);

  useEffect(() => {
    setIsSaved(false);
    setPlaying(false);
    setCount(0);
    if (html) {
      videosDuration.current = 0;
      audiosDuration.current = 0;
      renderMultimediaComponents();
      document.getElementsByClassName("main")[0].scrollTo({ top: 0, left: 0 });
      const videos = data.videos ? data.videos.split(',') : null;
      const audios = data.audios ? data.audios.split(',') : null;
      if (!videos && !audios) {
        if (type == "SUBLESSON"){
          setPlaying(true);
        }
      }
    }
  }, [html]);


  useEffect(()=>{
    if (count > 0) {
      console.log(count)
      let readyTimeVideos = true;
      let readyTimeAudios = true;
      let readyTimeOther = true;
      if (durationFromDB.current == false){
        if (artPlayerInstances.length > 0 && videosDuration.current > 0) {
          const currentPercentVideos = ((count * 100) / videosDuration.current)
          if (currentPercentVideos < MAX_DURATION_VIDEOS_PERCENTAGE ||  count > videosDuration.current) {
            readyTimeVideos = false;
          }
        }
  
        if (audiosDuration.current > 0) {
          const currentPercentAudios = ((count * 100) / audiosDuration.current)
          if (currentPercentAudios < MAX_DURATION_AUDIOS_PERCENTAGE ||  count > audiosDuration.current) {
            readyTimeAudios = false;
          }
        }
  
        if (artPlayerInstances.length == 0 && audiosDuration.current == 0) {
          if ((count < sublessonDuration.current || !isQuizFinalized.current) ||  count > sublessonDuration.current) {
            readyTimeOther = false;
          } 
        }
      }else{
        if ((count < sublessonDuration.current || !isQuizFinalized.current) ||  count > sublessonDuration.current) {
          readyTimeOther = false;
        } 
      }
      

      if (readyTimeVideos == true &&
        readyTimeAudios == true &&
        readyTimeOther == true) {
          setPlaying(false);
          setCount(0);
          insertView();
        }
    }
  }, [count])

  return (
    <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
      <OverlayLoader open={open} />
      <Grid item xs={12}>
        {html ? <div className="mt-content">{parse(html)}</div> : null}
      </Grid>
      { data && filePathDownload && filePathDownload.map(function(file) {
        return (
          <Grid item xs={12} className="download-button-container">
            <Button onClick={async()=>{
              await downloadFile(file.file);
            }} variant="outlined" download>{file.buttonText}</Button>
          </Grid>
        )
      })}
    
      <Grid item xs={12} className="lessons-button-container-center">
        <ButtomCustom onClick={()=>{
          onContinue();
        }} variant="contained" rounded>
          Continuar
        </ButtomCustom>
      </Grid>
      <input type={"hidden"} value={isSaved} id={"input-hidden-saved"} />
      <input type={"hidden"} value={isPlaying} id={"input-hidden-is-playing"} />
    </Grid>
  );
};

export default ContentRenderer;
