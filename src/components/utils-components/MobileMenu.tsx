// import React, { useState } from 'react';
// import { Box, List, ListItem, ListItemText, Collapse } from '@mui/material';
// import { ExpandLess, ExpandMore } from '@mui/icons-material';
// import MenuIcon from '@mui/icons-material/Menu';
// import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
// import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
// import SearchIcon from '@mui/icons-material/Search';
// import Image from 'next/image';
// import { useAppSelector } from '@/store/reduxHooks';
// import lightLogo from '../../../public/images/EbcoLogo.svg';
// import { customColors } from '@/styles/MuiThemeRegistry/theme';
// import './Header.css';

// type MenuItem = {
//     id: number;
//     label: string;
//     route: string;
//     children?: MenuItem[];
//     isOpen?: boolean;
// };

// type MenuMobileProp = {
//     id: number;
//     label: string;
//     route: string;
//     children?: MenuItem[];
//     isOpen?: boolean;
// };

// const MainMenuMobileData: MenuMobileProp[] = [
//     {
//         id: 1,
//         label: 'GENERAL',
//         route: '/',
//         children: [
//             {
//                 id: 11,
//                 label: 'Worksmart',
//                 route: '/',
//                 children: [
//                     {
//                         id: 111,
//                         label: 'Office Furniture fittings',
//                         route: '/',
//                         children: [
//                             {
//                                 id: 1111,
//                                 label: 'Smart Lifts',
//                                 route: '/',
//                                 children: [
//                                     {
//                                         id: 1,
//                                         label: 'Sliding door system',
//                                         route: '/',
//                                     },
//                                 ],
//                                 isOpen: false,
//                             },
//                             {
//                                 id: 2,
//                                 label: 'Safe Drawers',
//                                 route: '/',
//                             },
//                         ],
//                         isOpen: false,
//                     },
//                 ],
//                 isOpen: false,
//             },
//         ],
//         isOpen: true,
//     },
// ];

// const MobileMenu: React.FC<{ menuData: MenuMobileProp[] }> = ({ menuData }) => {
//     const [openState, setOpenState] = useState<Record<number, boolean>>({});
  
//     // Function to handle click on the label
//     const handleLabelClick = (id: number) => {
//       setOpenState((prevState) => ({
//         ...prevState,
//         [id]: !prevState[id],
//       }));
//     };
  
//     // Recursive function to render the menu
//     const renderMenu = (menuItems: MenuMobileProp[]) => {
//       return menuItems.map((item) => (
//         <React.Fragment key={item.id}>
//           <ListItem button onClick={() => handleLabelClick(item.id)}>
//             <ListItemText primary={item.label} />
//             {item.children && (openState[item.id] ? <ExpandLess /> : <ExpandMore />)}
//           </ListItem>
//           {item.children && (
//             <Collapse in={openState[item.id]} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 {renderMenu(item.children)}
//               </List>
//             </Collapse>
//           )}
//         </React.Fragment>
//       ));
//     };
  
//     return <List>{renderMenu(menuData)}</List>;
//   };
  
//   export default function App() {
//     return (
//       <Box>
//         <MobileMenu menuData={MainMenuMobileData} />
//       </Box>
//     );
//   }
