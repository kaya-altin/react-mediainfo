import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { css, cx } from "@emotion/css";
import MediaInfo from "mediainfo.js";

function createInputComponent({ multiple, accept }) {
  const el = document.createElement("input");
  // set input config
  el.type = "file";
  el.accept = accept;
  el.multiple = multiple;
  // return file input element
  return el;
}

const App = () => {
  const [textAreaValue, setTextAreaValue] = useState("");

  const readChunk = (file: any) => (chunkSize: number, offset: number) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (event.target.error) {
          reject(event.target.error);
        }
        resolve(new Uint8Array(event.target.result));
      };
      reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize));
    });

  const handleChange = (e: any) => {
    const target = e.target;
    const file = target.files;

    // remove event listener after operation
    target.removeEventListener("change", handleChange);

    // remove input element after operation
    target.remove();

    getMediaInfo(file);
  };

  const getMediaInfo = (files: any) => {
    const file = files[0];
    const mediaInfo = MediaInfo().then((mi) =>
      mi
        .analyzeData(() => file.size, readChunk(file))
        .then((result: any) => {
          console.log(result);
          setTextAreaValue(JSON.stringify(result));
          return mediaInfo;
        })
    );
  };

  const handleClick = () => {
    // create virtual input element
    const inputEL = createInputComponent({
      multiple: false,
      accept: "*.*",
    });
    // add event listener
    inputEL.addEventListener("change", handleChange, false);
    inputEL.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    inputEL.click();
  };

  return (
    <div>
      <button
        className={css`
          display: block;
        `}
        onClick={handleClick}
      >
        Select File
      </button>
      <textarea
        className={css`
          display: block;
          width: 100%;
          height: calc(70vh);
          margin-top: 20px;
        `}
        value={textAreaValue}
      ></textarea>
    </div>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
