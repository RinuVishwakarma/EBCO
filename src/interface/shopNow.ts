// productRange.tsx

export interface ShopNow {
    id: number;
    image: string;
    title:string;
    download:string,
    originalPrice:number,
    tag?:string,
    discountPrice:number,
}

const shopNow: ShopNow[] = [
    {
        id: 1,
        image: '/images/shop_now/shop-now-1.webp',
        title:'Sink Drip Mat',
        download:'',
        originalPrice:1238,
        discountPrice:1090,
        tag:'NEW ARRIVAL'
    },
    {
        id: 2,
        image: '/images/shop_now/shop-now-2.webp',
        title:'Shower Caddie',
        download:'',
        originalPrice:7632,
        discountPrice:6717,
    },
    {
        id: 3,
        image: '/images/shop_now/shop-now-3.webp',
        title:'Shelf Bracket Lite - 7',
        download:'',
        originalPrice:98,
        discountPrice:87,
        },
    {
        id: 4,
        image: '/images/shop_now/shop-now-4.webp',
        title:'Hanger Peg - Mount',
        download:'',
        originalPrice:88,
        discountPrice:78,
        },
   
];

export default shopNow;
