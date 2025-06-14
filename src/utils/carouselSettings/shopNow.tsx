const shopNow = {

dots: false,
infinite: false,
speed: 500,
slidesToShow: 4,
slidesToScroll: 1,
initialSlide: 0,
responsive: [
  {
    breakpoint: 1100,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 1,
      infinite: false,
      dots: false
    }
  },
  {
    breakpoint: 770,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 1,
      dots:true,

    }
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      dots:true
    }
  }
]
};
  
  export default shopNow