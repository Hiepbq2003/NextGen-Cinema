import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; 
import '@/asset/style/HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      type: 'youtube',
      videoId: '_inKs4eeHiI',
    },
    {
      id: 2,
      type: 'youtube',
      videoId: '-iFq6IcAxBc',
    },
    {
      id: 3,
      type: 'youtube',
      videoId: 'nb_fFj_0rq8',
    },
    {
      id: 4,
      type: 'youtube',
      videoId: '43R9l7EkJwE',
    },
    {
      id: 5,
      type: 'youtube',
      videoId: 'E3Huy2cdih0',
    }
  ];

  const length = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 10000);
    
    return () => clearInterval(timer); 
  }, [length]);

  const nextSlide = () => setCurrentSlide(currentSlide === length - 1 ? 0 : currentSlide + 1);
  const prevSlide = () => setCurrentSlide(currentSlide === 0 ? length - 1 : currentSlide - 1);

  return (
    <div className="hero-slider-container">
      <FaChevronLeft className="slider-arrow left-arrow" onClick={prevSlide} />
      <FaChevronRight className="slider-arrow right-arrow" onClick={nextSlide} />
      
      {slides.map((slide, index) => {
        return (
          <div
            className={index === currentSlide ? 'slide active' : 'slide'}
            key={slide.id}
            style={
              slide.type === 'youtube'
                ? {
                    backgroundImage: `url(https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}
            }
          >
            {index === currentSlide && (
              <>
                {slide.type === 'youtube' ? (
                  <iframe
                    className="slider-image"
                    src={`https://www.youtube.com/embed/${slide.videoId}?autoplay=1&mute=1&loop=1&playlist=${slide.videoId}&controls=0&showinfo=0&rel=0`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ 
                      width: '100vw', 
                      height: '100%', 
                      pointerEvents: 'none'
                    }}
                  ></iframe>
                ) : slide.type === 'image' ? (
                  <img src={slide.content} alt="banner" className="slider-image" />
                ) : (
                  <div className="video-placeholder">
                    <h2>{slide.title}</h2>
                    <p>Nhúng thẻ <b>&lt;video&gt;</b> hoặc <b>&lt;iframe&gt;</b> vào vùng này.</p>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      <div className="slider-dots">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={index === currentSlide ? 'dot active-dot' : 'dot'}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;