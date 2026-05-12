import { useEffect, useMemo, useRef, useState } from "react";
import { instagramPosts } from "../../data/instagramPosts";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  InstagramIcon,
  InstagramSmallIcon,
  PlayIcon,
} from "../common/Icons";

export default function InstagramCarousel() {
  const carouselRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(1);
  const [failedImages, setFailedImages] = useState(() => new Set());

  const pageCount = useMemo(
    () => Math.max(1, instagramPosts.length - visibleCards + 1),
    [visibleCards],
  );

  useEffect(() => {
    setCurrent((currentPage) => Math.min(currentPage, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    const updateVisibleCards = () => {
      const carousel = carouselRef.current;
      const firstCard = carousel?.querySelector(".insta-card");

      if (!carousel || !firstCard) {
        return;
      }

      const styles = window.getComputedStyle(carousel);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const cardStep = firstCard.offsetWidth + gap;
      const nextVisibleCards = Math.max(1, Math.floor((carousel.clientWidth + gap) / cardStep));

      setVisibleCards(Math.min(instagramPosts.length, nextVisibleCards));
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  const goTo = (index) => {
    const nextIndex = (index + pageCount) % pageCount;
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector(".insta-card");
    setCurrent(nextIndex);

    if (carousel && firstCard) {
      const styles = window.getComputedStyle(carousel);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      carousel.scrollTo({
        left: (firstCard.offsetWidth + gap) * nextIndex,
        behavior: "smooth",
      });
    }
  };

  const updateFromScroll = () => {
    const carousel = carouselRef.current;
    const firstCard = carousel?.querySelector(".insta-card");
    if (!carousel || !firstCard) return;

    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    const index = Math.round(carousel.scrollLeft / (firstCard.offsetWidth + gap));
    setCurrent(Math.min(index, pageCount - 1));
  };

  const markImageAsFailed = (href) => {
    setFailedImages((current) => {
      const next = new Set(current);
      next.add(href);
      return next;
    });
  };

  return (
    <section className="insta-section">
      <div className="insta-section__header">
        <div className="insta-section__title-wrap">
          <InstagramIcon />
          <h2 className="insta-section__title">Seguinos en Instagram</h2>
        </div>
        <a
          href="https://www.instagram.com/vtech.py"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-section__handle"
        >
          @vtech.py
        </a>
      </div>

      <div className="insta-carousel-wrapper">
        <button
          className="insta-carousel__arrow insta-carousel__arrow--prev"
          type="button"
          aria-label="Anterior"
          onClick={() => goTo(current - 1)}
        >
          <ChevronLeftIcon />
        </button>
        <div className="insta-carousel" ref={carouselRef} onScroll={updateFromScroll}>
          {instagramPosts.map((post, index) => (
            <a
              className="insta-card"
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              key={post.href}
            >
              <div className="insta-card__thumb">
                {failedImages.has(post.href) ? (
                  <div className="insta-card__fallback">
                    <InstagramSmallIcon />
                    <span>Contenido de Instagram</span>
                  </div>
                ) : (
                  <img
                    src={post.image}
                    alt={`Post V-TECH ${index + 1}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => markImageAsFailed(post.href)}
                  />
                )}
                <div className="insta-card__overlay">
                  {post.type === "Foto" ? <ImageIcon /> : <PlayIcon />}
                  <span>Ver {post.type === "Foto" ? "Publicación" : "Reel"}</span>
                </div>
              </div>
              <div className="insta-card__body">
                <div className="insta-card__meta">
                  <InstagramSmallIcon />
                  <span>@vtech.py</span>
                </div>
                <p className="insta-card__label">{post.type} · Ver en Instagram</p>
              </div>
            </a>
          ))}
        </div>
        <button
          className="insta-carousel__arrow insta-carousel__arrow--next"
          type="button"
          aria-label="Siguiente"
          onClick={() => goTo(current + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>

      <div className="insta-dots">
        {Array.from({ length: pageCount }).map((_, index) => (
          <button
            className={`insta-dot${current === index ? " insta-dot--active" : ""}`}
            type="button"
            aria-label={`Ir al grupo ${index + 1}`}
            onClick={() => goTo(index)}
            key={index}
          />
        ))}
      </div>
    </section>
  );
}
