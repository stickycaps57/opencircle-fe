import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Slide = { src: string };

export function useLightbox() {
  const [open, setOpen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  const openLightbox = (startIndex: number, newSlides: Slide[]) => {
    setSlides(newSlides);
    setIndex(startIndex);
    setOpen(true);
  };

  const closeLightbox = () => setOpen(false);

  const LightboxViewer = () => (
    <Lightbox
      open={open}
      slides={slides}
      index={index}
      close={closeLightbox}
      plugins={[Thumbnails]}
      noScroll={{ disabled: true }}
      styles={{
        root: { "--yarl__container_background_color": "rgba(0, 0, 0, 0.80)" },
      }}
      render={{
        slide: ({ slide }) => (
          <img
            src={slide.src}
            alt=""
            style={{
              width: "800px",
              height: "600px",
              objectFit: "cover",
            }}
          />
        ),
      }}
    />
  );

  return { openLightbox, LightboxViewer };
}