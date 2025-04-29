// productRange.tsx

import { MenuProp } from "@/interface/MenuData"

const MainMenuData: MenuProp[] = [
  {
    id: 1,
    label: 'Worksmart',
    route: '/worksmart',
    children: [{
      id: 1,
      label: 'Office Furniture fittings',
      route: '/',
      children: [{
        id: 123,
        label: 'Smart Lifts',
        route: '/worksmart',
      },
      {
        id: 113,
        label: 'Safe Drawers',
        route: '/',
      }]
    }]
  },
  {
    id: 11,
    label: 'Livsmart',
    route: '/livsmart',
    children: [{
      id: 12322,
      label: 'Kitchen Systems & Accessories and Peka',
      route: '/',
      children: [{
        id: 1223,
        label: 'Kitchen Systems & Accessories',
        route: '/worksmart',
      },
      {
        id: 1133,
        label: 'Peka',
        route: '/',
      }]
    }]
  },
  {
    id: 2,
    label: 'Ebco',
    route: '/ebco',
    children: [{
      id: 132,
      label: 'Window, door and glass fittings',
      route: '/ebco',
      children: [{
        id: 1,
        label: 'Sliding door system',
        route: '/',
        children: [{
          id: 1,
          label: 'Sliding door system 100- soft close',
          route: '/',
        },
        {
          id: 1,
          label: ' EBCO Sliding door system 100- soft close',
          route: '/',
        },
        ]
      },
      {
        id: 2,
        label: 'Ebco Sliding door system',
        route: '/',
        children: [{
          id: 1,
          label: 'Sliding door system 100- soft close',
          route: '/',
        },
        ]
      }]
    },
    {
      id: 2,
      label: 'EBCO Window, door and glass fittings',
      route: '/',
      children: [{
        id: 1,
        label: 'Sliding door systems',
        route: '/',
        children: [{
          id: 1,
          label: 'Sliding door system 100- soft close',
          route: '/',
        }]
      }]
    }]
  },
  {
    id: 3,
    label: 'Discovery Centers',
    route: '/discovery-centers',
    children: []
  },
  {
    id: 4,
    label: 'Distribution Network',
    route: '/distribution-network',
    children: []
  }
];

export default MainMenuData;

export interface MenuData {

  [x: string]: any;
  id: number;
  name: string;
  parent: number;
  count: number;
  menuOrder: number;
  description: string;
  image: {
    src: string;
  };
}

// export const MainMenuDataApi: MenuData[] = [
//     {
//         "id": 119,
//         "name": "2 Way Syncro Sliding Partition System 100 – Soft Close",
//         "parent": 116
//     },
//     {
//         "id": 95,
//         "name": "Aluminium Handles",
//         "parent": 94
//     },
//     {
//         "id": 87,
//         "name": "Aluminium Profile Decorative",
//         "parent": 86
//     },
//     {
//         "id": 88,
//         "name": "Aluminium Profile Edge",
//         "parent": 86
//     },
//     {
//         "id": 91,
//         "name": "Aluminium Profile Edge/Handle for Wardrobe Sliding",
//         "parent": 86
//     },
//     {
//         "id": 92,
//         "name": "Aluminium Profile for Wardrobe Sliding Partition",
//         "parent": 86
//     },
//     {
//         "id": 89,
//         "name": "Aluminium Profile Glass Shutter",
//         "parent": 86
//     },
//     {
//         "id": 86,
//         "name": "Aluminium Profiles",
//         "parent": 85
//     },
//     {
//         "id": 85,
//         "name": "Aluminium Profiles and Handles",
//         "parent": 74
//     },
//     {
//         "id": 93,
//         "name": "Aluminium Shutter Grill",
//         "parent": 86
//     },
//     {
//         "id": 20,
//         "name": "Articulated Keyboard Stations",
//         "parent": 17
//     },
//     {
//         "id": 101,
//         "name": "Bed & Wardrobe Fittings and Accessories",
//         "parent": 74
//     },
//     {
//         "id": 104,
//         "name": "Bed Fittings",
//         "parent": 101
//     },
//     {
//         "id": 30,
//         "name": "Bottom Mounting Series",
//         "parent": 29
//     },
//     {
//         "id": 44,
//         "name": "Cabinet & Glass Shelf Support",
//         "parent": 41
//     },
//     {
//         "id": 480,
//         "name": "Cable Organization",
//         "parent": 463
//     },
//     {
//         "id": 58,
//         "name": "Combination Lock",
//         "parent": 56
//     },
//     {
//         "id": 34,
//         "name": "Computer Keyboard Series",
//         "parent": 29
//     },
//     {
//         "id": 23,
//         "name": "Computer Monitor Arms",
//         "parent": 17
//     },
//     {
//         "id": 21,
//         "name": "Computer Wall Station",
//         "parent": 17
//     },
//     {
//         "id": 121,
//         "name": "Concealed series",
//         "parent": 29
//     },
//     {
//         "id": 78,
//         "name": "Corner Solutions",
//         "parent": 76
//     },
//     {
//         "id": 483,
//         "name": "CPU Stands",
//         "parent": 463
//     },
//     {
//         "id": 24,
//         "name": "CPU Stands",
//         "parent": 17
//     },
//     {
//         "id": 115,
//         "name": "Display Shelving Systems - Horizontal",
//         "parent": 59
//     },
//     {
//         "id": 114,
//         "name": "Display Shelving Systems - Vertical",
//         "parent": 59
//     },
//     {
//         "id": 64,
//         "name": "Door Closers",
//         "parent": 60
//     },
//     {
//         "id": 63,
//         "name": "Door Fittings",
//         "parent": 60
//     },
//     {
//         "id": 29,
//         "name": "Drawer Slides",
//         "parent": 28
//     },
//     {
//         "id": 28,
//         "name": "Drawer Slides & Hinges",
//         "parent": 27
//     },
//     {
//         "id": 77,
//         "name": "Drawer Systems & Accessories",
//         "parent": 76
//     },
//     {
//         "id": 27,
//         "name": "Ebco",
//         "parent": 0
//     },
//     {
//         "id": 98,
//         "name": "Edge Profile Handles",
//         "parent": 94
//     },
//     {
//         "id": 65,
//         "name": "Floor Springs",
//         "parent": 60
//     },
//     {
//         "id": 475,
//         "name": "Foldable Tables &amp; Tops",
//         "parent": 461
//     },
//     {
//         "id": 31,
//         "name": "Full Panel Series",
//         "parent": 29
//     },
//     {
//         "id": 471,
//         "name": "Furniture Lights",
//         "parent": 460
//     },
//     {
//         "id": 105,
//         "name": "Furniture Lights - LED",
//         "parent": 74
//     },
//     {
//         "id": 109,
//         "name": "Furniture Lights Accessories (24V)",
//         "parent": 105
//     },
//     {
//         "id": 108,
//         "name": "Furniture Lights LED - 12V",
//         "parent": 105
//     },
//     {
//         "id": 52,
//         "name": "Furniture Locks",
//         "parent": 27
//     },
//     {
//         "id": 472,
//         "name": "Furniture Safety Products",
//         "parent": 461
//     },
//     {
//         "id": 461,
//         "name": "General Hardware",
//         "parent": 0
//     },
//     {
//         "id": 41,
//         "name": "General Hardware",
//         "parent": 27
//     },
//     {
//         "id": 68,
//         "name": "Glass Connectors",
//         "parent": 60
//     },
//     {
//         "id": 66,
//         "name": "Glass Door Handles",
//         "parent": 60
//     },
//     {
//         "id": 39,
//         "name": "Glass Door Hinges",
//         "parent": 36
//     },
//     {
//         "id": 69,
//         "name": "Glass Door Locks",
//         "parent": 60
//     },
//     {
//         "id": 90,
//         "name": "Gola Profiles & Accessories",
//         "parent": 86
//     },
//     {
//         "id": 94,
//         "name": "Handles and Knobs",
//         "parent": 85
//     },
//     {
//         "id": 33,
//         "name": "Heavy Duty Series",
//         "parent": 29
//     },
//     {
//         "id": 479,
//         "name": "Height Adjustable Desks",
//         "parent": 463
//     },
//     {
//         "id": 102,
//         "name": "Hi Slides Wardrobe Sliding Systems",
//         "parent": 101
//     },
//     {
//         "id": 36,
//         "name": "Hinges",
//         "parent": 28
//     },
//     {
//         "id": 45,
//         "name": "Ironing Board",
//         "parent": 41
//     },
//     {
//         "id": 49,
//         "name": "Joinery Fitting",
//         "parent": 48
//     },
//     {
//         "id": 48,
//         "name": "Joinery Fittings & Screws",
//         "parent": 27
//     },
//     {
//         "id": 22,
//         "name": "Keyboard Trays",
//         "parent": 17
//     },
//     {
//         "id": 482,
//         "name": "Keyboard Trays",
//         "parent": 463
//     },
//     {
//         "id": 459,
//         "name": "Kitchen Accessories",
//         "parent": 0
//     },
//     {
//         "id": 83,
//         "name": "Kitchen Plinth & Accessories",
//         "parent": 76
//     },
//     {
//         "id": 76,
//         "name": "Kitchen Systems & Accessories",
//         "parent": 75
//     },
//     {
//         "id": 75,
//         "name": "Kitchen Systems & Accessories and Peka.",
//         "parent": 74
//     },
//     {
//         "id": 97,
//         "name": "Knobs",
//         "parent": 94
//     },
//     {
//         "id": 470,
//         "name": "Knobs &amp; Handles",
//         "parent": 460
//     },
//     {
//         "id": 107,
//         "name": "Linear Lights (24V)",
//         "parent": 105
//     },
//     {
//         "id": 118,
//         "name": "Linked Sliding Partition System 100 – Soft Close",
//         "parent": 116
//     },
//     {
//         "id": 74,
//         "name": "Livsmart",
//         "parent": 0
//     },
//     {
//         "id": 110,
//         "name": "Luminor",
//         "parent": 105
//     },
//     {
//         "id": 42,
//         "name": "Machines, Jigs and Cutters",
//         "parent": 41
//     },
//     {
//         "id": 473,
//         "name": "Magnetic Catch",
//         "parent": 461
//     },
//     {
//         "id": 47,
//         "name": "Magnetic Catch - Ultra Slim",
//         "parent": 41
//     },
//     {
//         "id": 81,
//         "name": "Midway Systems",
//         "parent": 76
//     },
//     {
//         "id": 50,
//         "name": "Mini Fix",
//         "parent": 48
//     },
//     {
//         "id": 100,
//         "name": "Miscellaneous Handles",
//         "parent": 94
//     },
//     {
//         "id": 481,
//         "name": "Monitor Holders",
//         "parent": 463
//     },
//     {
//         "id": 26,
//         "name": "New Products",
//         "parent": 0
//     },
//     {
//         "id": 25,
//         "name": "Office Furniture Essentials",
//         "parent": 17
//     },
//     {
//         "id": 17,
//         "name": "Office Furniture Fittings",
//         "parent": 16
//     },
//     {
//         "id": 463,
//         "name": "Office Furniture Fittings",
//         "parent": 0
//     },
//     {
//         "id": 46,
//         "name": "Other Hardware",
//         "parent": 41
//     },
//     {
//         "id": 474,
//         "name": "Other Hardwares",
//         "parent": 461
//     },
//     {
//         "id": 467,
//         "name": "Other Kitchen Essentials",
//         "parent": 459
//     },
//     {
//         "id": 80,
//         "name": "Overhead Systems",
//         "parent": 76
//     },
//     {
//         "id": 67,
//         "name": "Patch Fittings",
//         "parent": 60
//     },
//     {
//         "id": 84,
//         "name": "Peka",
//         "parent": 75
//     },
//     {
//         "id": 73,
//         "name": "Plastic Seals",
//         "parent": 60
//     },
//     {
//         "id": 43,
//         "name": "Plinths, Furnfelt & Bumpers",
//         "parent": 41
//     },
//     {
//         "id": 113,
//         "name": "Pole Shelving Systems",
//         "parent": 59
//     },
//     {
//         "id": 477,
//         "name": "Power Sockets &amp; Charging",
//         "parent": 463
//     },
//     {
//         "id": 54,
//         "name": "Premium Locks",
//         "parent": 52
//     },
//     {
//         "id": 32,
//         "name": "Premium Series",
//         "parent": 29
//     },
//     {
//         "id": 112,
//         "name": "Products",
//         "parent": 0
//     },
//     {
//         "id": 37,
//         "name": "Regular / Euro Series",
//         "parent": 36
//     },
//     {
//         "id": 59,
//         "name": "Retail Display Systems",
//         "parent": 27
//     },
//     {
//         "id": 19,
//         "name": "Safe Drawers",
//         "parent": 17
//     },
//     {
//         "id": 484,
//         "name": "Safe Drawers",
//         "parent": 463
//     },
//     {
//         "id": 51,
//         "name": "Screws",
//         "parent": 48
//     },
//     {
//         "id": 57,
//         "name": "SecuRite Cupboard Lock",
//         "parent": 56
//     },
//     {
//         "id": 53,
//         "name": "SecuTek Locks",
//         "parent": 52
//     },
//         {
//             "id": 71,
//             "name": "Shower Fittings",
//             "parent": 60
//         },
//         {
//             "id": 70,
//             "name": "Shower Hinges",
//             "parent": 60
//         },
//         {
//             "id": 72,
//             "name": "Shower Sliding Fittings",
//             "parent": 60
//         },
//         {
//             "id": 99,
//             "name": "Shutter Handles",
//             "parent": 94
//         },
//         {
//             "id": 35,
//             "name": "Sleek Telescopic Series",
//             "parent": 29
//         },
//         {
//             "id": 111,
//             "name": "Sliding Door Lock ",
//             "parent": 56
//         },
//         {
//             "id": 117,
//             "name": "Sliding Door System 100 – Soft Close",
//             "parent": 116
//         },
//         {
//             "id": 116,
//             "name": "Sliding Door Systems",
//             "parent": 60
//         },
//         {
//             "id": 62,
//             "name": "Sliding Window Latches",
//             "parent": 60
//         },
//         {
//             "id": 464,
//             "name": "Smart Ladders",
//             "parent": 459
//         },
//         {
//             "id": 18,
//             "name": "Smart Lifts",
//             "parent": 17
//         },
//         {
//             "id": 40,
//             "name": "Soft Close Hinges",
//             "parent": 36
//         },
//         {
//             "id": 38,
//             "name": "Speciality Hinges",
//             "parent": 36
//         },
//         {
//             "id": 56,
//             "name": "Speciality Locks",
//             "parent": 52
//         },
//         {
//             "id": 106,
//             "name": "Spot Lights (24V)",
//             "parent": 105
//         },
//         {
//             "id": 465,
//             "name": "Storage Organization",
//             "parent": 459
//         },
//         {
//             "id": 79,
//             "name": "Storage Systems",
//             "parent": 76
//         },
//         {
//             "id": 55,
//             "name": "Target Series",
//             "parent": 52
//         },
//         {
//             "id": 460,
//             "name": "Wardrobe Accessories",
//             "parent": 0
//         },
//         {
//             "id": 103,
//             "name": "Wardrobe Accessories",
//             "parent": 101
//         },
//         {
//             "id": 468,
//             "name": "Wardrobe Drawer Organizer",
//             "parent": 460
//         },
//         {
//             "id": 469,
//             "name": "Wardrobe Essentials",
//             "parent": 460
//         },
//         {
//             "id": 466,
//             "name": "Waste Bins",
//             "parent": 459
//         },
//         {
//             "id": 82,
//             "name": "Waste Bins & More",
//             "parent": 76
//         },
//         {
//             "id": 478,
//             "name": "WFH Solution",
//             "parent": 463
//         },
//         {
//             "id": 462,
//             "name": "WFH Solutions",
//             "parent": 0
//         },
//         {
//             "id": 61,
//             "name": "Window Fittings",
//             "parent": 60
//         },
//         {
//             "id": 60,
//             "name": "Window, Door & Glass Hardware",
//             "parent": 27
//         },
//         {
//             "id": 476,
//             "name": "Workdesk Essentials",
//             "parent": 463
//         },
//         {
//             "id": 16,
//             "name": "Worksmart",
//             "parent": 0
//         },
//         {
//             "id": 120,
//             "name": "Zen Décor Handles",
//             "parent": 94
//         },
//         {
//             "id": 96,
//             "name": "Zinc Handles",
//             "parent": 94
//         }

// ]

export const secondaryMenuData = [
  {
    name: "Office Furniture Fittings",
    link: "/",
    children: [
      {
        id: 123,
        label: "Smart Lifts",
        route: "/",
        image: "/images/menu/smart-lift.jpg",
      },
      {
        id: 2,
        label: "Safe Drawers",
        route: "/",
        image: "/images/menu/safe-drawer.jpg",
      },
      {
        id: 3,
        label: "Articulated Keyboard Stations",
        route: "/",
        image: "/images/menu/keyboard.jpg",
      },
      {
        id: 3,
        label: "Computer Wall Station",
        route: "/",
        image: "/images/menu/computer-wall.png",
      },
      {
        id: 3,
        label: "Keyboard Trays",
        route: "/",
        image: "/images/menu/computer-tray.png",
      },
      {
        id: 3,
        label: "Computer Monitor Arms",
        route: "/",
        image: "/images/menu/monitor.jpeg",
      },
      {
        id: 3,
        label: "CPU Stands",
        route: "/",
        image: "/images/menu/stand.jpg",
      },
      {
        id: 3,
        label: "Office Furniture Essentials",
        route: "/",
        image: "/images/menu/essentials.jpg",
      },
    ],
  },
  {
    name: "Kitchen Systems",
    link: "/",
    children: [],
  },
  {
    name: "Bed & Wardrobe Fittings",
    link: "/",
    children: [],
  },
  {
    name: "Furniture Lights",
    link: "/",
    children: [],
  },
  {
    name: "More",
    link: "/",
    children: [
      {
        id: 132,
        label: "Window, Door & Glass Fittings",
        route: "/",
        image: "/images/menu/sliding.jpg",
      },
      {
        id: 4,
        label: "Drawer Slides & Hinges",
        route: "/",
        image: "/images/menu/slide.jpg",
      },
      {
        id: 5,
        label: "Joinery Fittings & Screws",
        route: "/",
        image: "/images/menu/screw.jpg",
      },

      {
        name: "General Hardware",
        link: "/",
        children: [],
      },
    ],
  },
]