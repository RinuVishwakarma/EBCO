const productRangeSettings = {
  focusOnSelect: true,
  swipeToSlide: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode:false,
  speed: 500,
  arrows:false,
  dots:true,
  variableWidth: true,
  infinite: false,
  initialSlide: 0, // Ensure first slide is initially active
customPaging:( i:any) => (
  <div
    style={{
    }}
  >
   
  </div>
),
responsive: [
  {
    breakpoint: 1024,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true
    }
  },
  {
    breakpoint: 600,
    settings: {
      slidesToShow:1,
      slidesToScroll: 1,
      initialSlide: 2
    }
  },
  {
    breakpoint: 480,
    settings: {
      slidesToShow: 1,
      slidesToScroll: 1
    }
  }
]
};

export default productRangeSettings