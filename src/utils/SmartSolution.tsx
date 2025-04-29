import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import formatPrice from './formatPrice';
import { containsScreenReaderText, extractRegularPrice, extractSalePrice } from './extractPrice';
import { SmartSolutions } from '@/interface/smartSolutions';
import { customColors } from '@/styles/MuiThemeRegistry/theme';

interface SmartSolutionCardProps {
    item: SmartSolutions;
    i: number;
    handleSmartSolution: (item: SmartSolutions) => string;
}

const SmartSolutionCard: React.FC<SmartSolutionCardProps> = ({
    item,
    i,
    handleSmartSolution
}) => {
    const href = handleSmartSolution(item);

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
            <Link  prefetch={false}
                href={href}
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
                    {/* Product Images */}
                    <Box className="smart-solutions-product-image">
                        <Image
                            className="smart-solutions-product-img"
                            src={item.image[0]?.src}
                            alt={item.title}
                            width={200}
                            height={200}
                        />
                        {item.image[1] && (
                            <Image
                                className="smart-solutions-product-img"
                                src={item.image[1]?.src}
                                alt={item.title}
                                width={200}
                                height={200}
                            />
                        )}
                    </Box>

                    {/* Product Title */}
                    <Typography
                        className="smart-solutions-product-title"
                        sx={{
                            color: "#e4e3e3",
                            fontFamily: "Uniform Light",
                        }}
                    >
                        {item.title}
                    </Typography>

                    {/* Product Pricing */}
                    {item.has_options &&
                        containsScreenReaderText(item.priceHtml!) && (
                            <>
                                <Typography
                                    className="smart-solutions-product-description-mrp"
                                    sx={{
                                        fontFamily: "Uniform Light",
                                        textDecoration: "line-through",
                                        color: "#cce7f9de",
                                        zIndex: 2,
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    MRP : {formatPrice(Number(extractRegularPrice(item?.priceHtml!)).toFixed(2))}
                                </Typography>
                                <Typography
                                    className="smart-solutions-product-description"
                                    sx={{
                                        color: customColors.whiteEbco,
                                        fontFamily: "Uniform Bold",
                                    }}
                                >
                                    {formatPrice(Number(extractSalePrice(item?.priceHtml!)).toFixed(2))}
                                </Typography>
                            </>
                        )}

                    {item.has_options &&
                        !containsScreenReaderText(item.priceHtml!) && (
                            <Typography
                                className="smart-solutions-product-description"
                                sx={{
                                    color: customColors.whiteEbco,
                                    fontFamily: "Uniform Bold",
                                }}
                                dangerouslySetInnerHTML={{ __html: item.priceHtml! }}
                            />
                        )}

                    {/* Non-option product pricing */}
                    {!item.has_options && (
                        <>
                            <Typography
                                className="smart-solutions-product-description-mrp"
                                sx={{
                                    fontFamily: "Uniform Light",
                                    textDecoration: "line-through",
                                    color: "#cce7f9de",
                                    zIndex: 2,
                                    fontSize: "0.8rem",
                                }}
                            >
                                MRP : {formatPrice(item.price!)}
                            </Typography>
                            <Typography
                                className="smart-solutions-product-description"
                                sx={{
                                    color: customColors.whiteEbco,
                                    fontFamily: "Uniform Bold",
                                }}
                            >
                                {formatPrice(item.discountedPrice!)}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Mobile View */}
                <Box
                    className="Mobile-view-smart-solutions-product bg-center column-space-between"
                    key={item.id + "mobile"}
                    sx={{
                        backgroundImage: `url(${item.image[0]?.src})`,
                        justifyContent: "flex-end",
                        paddingBottom: "1rem",
                    }}
                    onClick={() => handleSmartSolution(item)}
                >
                    <Box className="bg-opaque" sx={{ position: "absolute" }}></Box>
                    <Typography
                        className="smart-solutions-product-title"
                        sx={{ color: "#e4e3e3" }}
                    >
                        {item.title}
                    </Typography>

                    {/* Repeat pricing logic for mobile */}
                    {!item.has_options && (
                        <>
                            <Typography
                                className="smart-solutions-product-description-mrp"
                                sx={{
                                    fontFamily: "Uniform Light",
                                    textDecoration: "line-through",
                                    color: "#cce7f9de",
                                    zIndex: 2,
                                    fontSize: "0.8rem",
                                }}
                            >
                                MRP : {formatPrice(item.price!)}
                            </Typography>
                            <Typography
                                className="smart-solutions-product-description"
                                sx={{
                                    color: customColors.whiteEbco,
                                    fontFamily: "Uniform Bold",
                                }}
                            >
                                {formatPrice(item.discountedPrice!)}
                            </Typography>
                        </>
                    )}

                    {item.has_options &&
                        containsScreenReaderText(item.priceHtml!) && (
                            <>
                                <Typography
                                    className="smart-solutions-product-description-mrp"
                                    sx={{
                                        fontFamily: "Uniform Light",
                                        textDecoration: "line-through",
                                        color: "#cce7f9de",
                                        zIndex: 2,
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    MRP : ₹{Number(extractRegularPrice(item?.priceHtml!)).toFixed(2)}
                                </Typography>
                                <Typography
                                    className="smart-solutions-product-description"
                                    sx={{
                                        color: customColors.whiteEbco,
                                        fontFamily: "Uniform Bold",
                                    }}
                                >
                                    ₹{Number(extractSalePrice(item?.priceHtml!)).toFixed(2)}
                                </Typography>
                            </>
                        )}

                    {item.has_options &&
                        !containsScreenReaderText(item.priceHtml!) && (
                            <p
                                className="smart-solutions-product-description"
                                style={{
                                    color: customColors.whiteEbco,
                                    fontFamily: "Uniform Bold",
                                }}
                                dangerouslySetInnerHTML={{ __html: item.priceHtml! }}
                            ></p>
                        )}
                </Box>
            </Link>
        </motion.div>
    );
};

export default SmartSolutionCard;
