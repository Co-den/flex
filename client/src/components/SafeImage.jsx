// src/components/SafeImage.jsx
import React, { useState } from "react";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect fill='#f3f4f6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='Arial,sans-serif' font-size='24'>Image unavailable</text></svg>`
  );

export default function SafeImage({
  src,
  alt = "",
  className = "",
  style = {},
  loading = "lazy",
  onClick,
}) {
  const [imgSrc, setImgSrc] = useState(src || PLACEHOLDER);
  const handleError = () => setImgSrc(PLACEHOLDER);

  // ensure no raw spaces break the URL
  const safeSrc = typeof imgSrc === "string" ? encodeURI(imgSrc) : imgSrc;

  return (
    <img
      src={safeSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      onError={handleError}
      onClick={onClick}
    />
  );
}
