import CertificationContainer from "@/components/containers/CertificationContainer";
import { Box } from "@mui/material";

export const metadata = {
  title: "Certifications",
  description:
    "At Ebco we prioritize excellence with ISO certifications in Quality Management, Environmental Management, and Occupational Health & Safety. Our Vasai and Palghar plants reflect our commitment to superior manufacturing standards and increased production capacity.",
};

const Certification = () => {
  return (
    <Box>
      <CertificationContainer />
    </Box>
  );
};

export default Certification;
