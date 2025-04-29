import { Box, Typography } from "@mui/material";

interface DividerProps {
  color: string;
  width: string;
  margin?: string;
}

const Divider = ({ color, width, margin = "1rem auto" }: DividerProps) => {
  return (
    <Box sx={{ width, height: "1px", backgroundColor: color, margin }}></Box>
  );
};

export default Divider;
