import { customColors } from "@/styles/MuiThemeRegistry/theme";
import { Box, Typography } from "@mui/material";
import "@/components/utils-components/Product/Product.css";
interface SearchedProductProd {
  id: number;
  image: string;
  title: string;
  description: string;
}
const SearchedProduct = ({
  item,
  index,
}: {
  item: SearchedProductProd;
  index: number;
}) => {
  return (
    <Box className="row-space-between searched-product" key={index}>
      <Typography
        className="search-product-title w-100 single-line"
        sx={{
          color: customColors.darkBlueEbco,
          fontSize: "14px !important",
        }}
      >
        {item.title}
      </Typography>
    </Box>
  );
};

export default SearchedProduct;
