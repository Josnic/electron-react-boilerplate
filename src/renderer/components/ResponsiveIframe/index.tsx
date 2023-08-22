import React, { useState, useEffect, useCallback, useRef } from "react";

interface IProps {
    sourceUrl: string;
    resize?: boolean;
    title: string;
}

const VideoIframe: React.FC<IProps> = (props) => {
  const { sourceUrl, title, id} = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const defaultHeight = 495;
  const [videoHeight, setVideoHeight] = useState<number>(
    iframeRef.current ? iframeRef.current.offsetWidth * 0.5625 : defaultHeight
  );

  const onresize = (dom_elem, callback) => {
    const resizeObserver = new ResizeObserver(() => callback() );
    resizeObserver.observe(dom_elem);
  };
  const handleChangeVideoWidth = useCallback(() => {
    const ratio =
      window.innerWidth > 990
        ? 1.0
        : window.innerWidth > 522
        ? 1.2
        : window.innerWidth > 400
        ? 1.45
        : 1.85;
    const height = iframeRef.current
      ? iframeRef.current.offsetWidth * 0.5625
      : defaultHeight;
    return setVideoHeight(Math.floor(height * ratio) - 50);
  }, []);

  const handleChangeVideoWidth2 = useCallback(() => {
    const ratio =
      window.innerWidth > 990
        ? 1.0
        : window.innerWidth > 522
        ? 1.2
        : window.innerWidth > 400
        ? 1.45
        : 1.85;
    const height = iframeRef.current
      ? iframeRef.current.offsetWidth * 0.5625
      : defaultHeight;
    return setVideoHeight(Math.floor(height * ratio) - 50);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleChangeVideoWidth);
    const ratio =
      window.innerWidth > 990
        ? 1.0
        : window.innerWidth > 522
        ? 1.2
        : window.innerWidth > 400
        ? 1.45
        : 1.85;
    const height = iframeRef.current
      ? iframeRef.current.offsetWidth * 0.5625
      : defaultHeight;
    setVideoHeight(Math.floor(height * ratio) - 50);
    return function cleanup() {
      window.removeEventListener("resize", handleChangeVideoWidth);
    };
  }, [videoHeight, handleChangeVideoWidth]);

  useEffect(()=>{
    const bb = document.getElementById(id)
    onresize(bb, function () {
        handleChangeVideoWidth2()
      })
  }, [])

  return (
    <iframe
      ref={iframeRef}
      title={title}
      width="95%"
      height={`${videoHeight}px`}
      src={sourceUrl}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoIframe;