import React from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { customColors } from '@/styles/MuiThemeRegistry/theme';

export interface FeaturedPage {
    title: string;
    image: string;
    link: string;
}

export const featuredPages: FeaturedPage[] = [
    {
        title: 'Furniture Lights',
        image: '/images/smart_solutions/Furniture lights.png',
        link: 'https://ebco.in/featured/furniture-lights'
    },
    {
        title: 'Cube Shelving System',
        image: '/images/smart_solutions/Cube Shelving System.png',
        link: 'https://ebco.in/featured/cube-shelving-system'
    },
    {
        title: 'Kitchen Systems and Accessories',
        image: '/images/smart_solutions/Kitchen Systems and Accessories.png',
        link: 'https://ebco.in/featured/kitchen-systems-and-accessories'
    }
];

interface SmartSolutionCardProps {
    item: FeaturedPage;
    i: number;
}

const SmartSolutionCard: React.FC<SmartSolutionCardProps> = ({
    item,
    i
}) => {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            transition={{
                duration: i * 0.2,
                ease: "easeInOut",
            }}
            variants={{
                visible: { opacity: 1, transform: "translateY(10px)" },
                hidden: { opacity: 0, transform: "translateY(100px)" },
            }}
            key={i}
        >
            <Link
                href={item.link}
                passHref
                key={i}
                rel="noopener noreferrer"
                className='w-100'
            >
                <Box
                    className="smart-solutions-product"
                    key={i}
                    sx={{ cursor: "pointer" }}
                >
                    {/* Product Image */}
                    <Box 
                        className="smart-solutions-product-image"
                        // sx={{
                        //     overflow: 'hidden',
                        //     position: 'relative',
                        //     width: '100%',
                        //     height: '200px',
                        //     '&:hover img': {
                        //         transform: 'scale(1.05)',
                        //         transition: 'transform 0.3s ease-in-out'
                        //     }
                        // }}
                        sx={{
                            overflow: 'hidden',
                            '&:hover img': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.3s ease-in-out'
                            }
                        }}
                    >
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            priority
                            style={{ 
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease-in-out'
                            }}
                        />
                    </Box>

                    {/* Product Title */}
                    <Typography
                        sx={{
                            color: "#e4e3e3",
                            fontFamily: "Uniform",
                            fontSize:"1.3rem",
                            fontWeight:"normal",
                            position: 'relative',
                            zIndex: 2,
                            marginTop: '0.5rem',
                            overflow: 'hidden',
                            display: 'block'
                        }}
                    >
                        {item.title}
                    </Typography>
                </Box>

                {/* Mobile View */}
                <Box
                    className="Mobile-view-smart-solutions-product"
                    key={item.title + "mobile"}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '200px',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        padding: 0,
                        margin: 0,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
                            zIndex: 1
                        }
                    }}
                >
                    <Box sx={{ 
                        position: 'absolute', 
                        width: '100%', 
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 0,
                        margin: 0
                    }}>
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            priority
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                display: 'block',
                                padding: 0,
                                margin: 0
                            }}
                        />
                    </Box>
                    <Typography
                        className="smart-solutions-product-title"
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '1rem',
                            textAlign: 'center',
                            color: "#e4e3e3",
                            fontSize: '1.3rem',
                            fontFamily: 'Uniform',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            marginBottom: 0
                        }}
                    >
                        {item.title}
                    </Typography>
                </Box>
            </Link>
        </motion.div>
    );
};

export default SmartSolutionCard;
