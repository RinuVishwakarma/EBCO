import { customColors } from "@/styles/MuiThemeRegistry/theme";
import Image from "next/image";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        padding: "1rem",
        border: `1px solid ${customColors.darkBlueEbco}`,
        borderRadius: "50%",
        width: "64px",
        height: "64px",
      }}
      onClick={onClick}
    >
      <Image
        src="/images/next_icon.svg"
        alt="Next icon"
        width={24}
        height={18}
      />
    </div>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  //console.log(onClick)
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        padding: "1rem",
        border: `1px solid ${customColors.darkBlueEbco}`,
        borderRadius: "50%",
        width: "64px",
        height: "64px",
      }}
      onClick={onClick}
    >
      <Image
        src="/images/prev_icon.svg"
        alt="Previous icon"
        width={24}
        height={18}
      />
    </div>
  );
}

const newsEvents = {
  focusOnSelect: true,
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  // centerMode:true,
  speed: 0,
  arrows: true,
  dots: true,
  // variableWidth: true,
  initialSlide: 0, // Ensure first slide is initially active
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  customPaging: (i: any) => <div style={{}}></div>,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        infinite: true,

        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export default newsEvents;
