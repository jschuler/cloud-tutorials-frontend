import React from "react";
import { Spinner, Bullseye } from "@patternfly/react-core";
import "./YoutubeEmbed.css";

export const YoutubeEmbed = ({
  url,
  embedId,
}: {
  url?: string;
  embedId?: string;
}) => {
  const fullUrl = embedId ? `https://www.youtube.com/embed/${embedId}` : url;
  return (
    <div className="tut-embed-container">
      <div className="tut-embed-spinner">
        <Spinner isSVG />
      </div>
      <iframe
        className="tut-embed-video"
        width="560"
        height="315"
        src={fullUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
