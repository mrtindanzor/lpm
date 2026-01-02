"use client";

import { useEffect, useState } from "react";
import type { PreviewImageProps } from "./type";
import MyImage from "../Image";

export default function PreviewImage({ file, doUpload }: PreviewImageProps) {
  const [image, setImage] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImage(url);
    if (doUpload) doUpload(file);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, doUpload]);

  return <div>{image && <MyImage url={image} title={file.name} />}</div>;
}
