// components/ProductDetailsModal.tsx
import { Dialog, DialogContent, DialogTitle, Typography, Box } from "@mui/material";
import React from "react";
import { Order } from "@/interface/Order";
import formatPrice from "@/utils/formatPrice";

interface ProductDetailsModalProps {
    open: boolean;
    onClose: () => void;
    order: Order;
}
import './Order.css'

import CloseIcon from '@mui/icons-material/Close';
const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, onClose, order }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{
                backgroundColor: "#F1F3F6",
                padding: "20px",
                fontSize: "1.2rem",
                fontWeight: "500",
                textAlign: "center",
                color: "#092853",
                fontFamily: 'Uniform Bold !important',
                borderBottom: "1px solid #E0E6EB",
                position: 'relative'
            }}>Order Details #{order.id}
                <Box sx={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    color: '#092853',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    zIndex: 1000
                }}
                    onClick={() => {
                        onClose();
                    }}
                >
                    <CloseIcon />
                </Box>
            </DialogTitle>
            <DialogContent sx={{
                maxHeight: '85vh !important',
            }}>
                <Box sx={{
                    paddingTop: "12px",
                }}>
                    {order?.line_items?.map((item, index) => (
                        <Box key={index} mb={2} className="row-space-between" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: "stretch" }}>
                            <Box className="item-title-details" sx={{ flex: 2, display: 'flex', justifyContent: 'center', borderRight: '1px solid #ddd', padding: '0 10px' }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Uniform Medium !important',
                                    fontSize: '0.9rem',
                                    color: '#092853',
                                    textAlign: 'justify',

                                }}>{item.name}</Typography>
                            </Box>
                            <Box className="item-title-details" sx={{ flex: 1, display: 'flex', justifyContent: 'center', borderRight: '1px solid #ddd', padding: '0 10px' }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Uniform Medium !important',
                                    fontSize: '0.9rem',
                                    color: '#092853',
                                    textAlign: 'justify',
                                    display: 'flex',


                                }}><span style={{
                                    fontFamily: 'Uniform Medium !important',
                                    fontSize: '0.9rem',
                                    color: '#092853',
                                    textAlign: 'justify',
                                    marginRight: '10px'

                                }}
                                    className="desktop-view"
                                >Quantity:</span> {item.quantity}</Typography>
                            </Box>
                            <Box className="item-title-details" sx={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 10px' }}>
                                <Typography variant="h6" sx={{
                                    fontFamily: 'Uniform Medium !important',
                                    fontSize: '0.9rem',
                                    color: '#092853',
                                    textAlign: 'justify',
                                    display: 'flex',


                                }}><span style={{
                                    fontFamily: 'Uniform Medium !important',
                                    fontSize: '0.9rem',
                                    color: '#092853',
                                    textAlign: 'justify',
                                    marginRight: '10px'

                                }}
                                    className="desktop-view"
                                >Amount:</span> {formatPrice(item.total)}</Typography>
                            </Box>
                        </Box>

                    ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '0', flexDirection: 'column' }}>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', margin: '0 !important' }}>
                        <Typography sx={{
                            fontFamily: 'Uniform Bold !important',
                            fontSize: '1.5rem',
                            color: '#092853',
                            textAlign: 'justify',
                            display: 'flex',

                        }}>Total <span className="desktop-view" style={{
                            fontFamily: 'Uniform Bold !important',
                            fontSize: '1.5rem',
                            color: '#092853',
                            textAlign: 'justify',
                            marginRight: '10px'
                        }}>Amount</span>:  {formatPrice(order.total)}</Typography>
                    </Box>
                    <Box className="footer-text order-footer-text" sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', color: '#bbb', padding: '0 10px', textAlign: 'end', fontSize: '18px' }}>
                        {Number(order.total) < 500
                            ? `${formatPrice(order.total)} will be charged on order`
                            : `No additional charges for orders above ${formatPrice(500)}`}
                    </Box>

                </Box>
            </DialogContent>

        </Dialog>
    );
};

export default ProductDetailsModal;
