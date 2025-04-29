import { Box } from "@mui/material";
import "./brochure/Brochure.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import { useEffect, useState } from "react";

const MyEventsCarousal = ({ images }) => {
  //console.log(images , "IMAGESSS");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imagess , setImagess] = useState(images)
  const [imagesss , setImagesss] = useState(images)
  useEffect(() => {
    return () => {
      if (thumbsSwiper) {
        thumbsSwiper.destroy(true, true);
      }
    };
  }, [thumbsSwiper]);

  return (
    <Box className="column-center carousal-container-events-details">
      <Swiper
        loop={true}
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs , Pagination]}
        className="mySwiper2 events-swiper-1"
      >
        {imagess?.slice(0,10).map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} alt={`slide-${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
     
        spaceBetween={10}
        slidesPerView={imagesss.length > 3 ? 5 : imagesss.length}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper events-swiper-2"
      >
        {imagess?.slice(0,10)?.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} alt={`thumb-${index}-${item}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default MyEventsCarousal;
