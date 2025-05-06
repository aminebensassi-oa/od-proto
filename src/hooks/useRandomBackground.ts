import { useEffect, useState } from "react";

export const useRandomBackground = () => {
  const [background, setBackground] = useState<string>("");

  const backgroundImages = [
    "https://picsum.photos/1600/900?random=1",
    "https://picsum.photos/1600/900?random=2",
    "https://picsum.photos/1600/900?random=3",
    "https://picsum.photos/1600/900?random=4",
  ];

  useEffect(() => {
    setBackground(
      backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    );
  }, []);

  return background;
};
