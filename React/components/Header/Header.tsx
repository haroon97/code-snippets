import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      paddingX={2}
      paddingY={2}
      justifyContent={"space-between"}
      alignItems={"center"}
      boxShadow={2}
    >
      <Box display="flex" alignItems="center">
        <Box marginRight={0.5}>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <ArrowBack color="primary" fontSize="medium" />
          </IconButton>
        </Box>
        <Typography variant="h4" color={theme.colors.highEmphasis}>
          Go to home page
        </Typography>
      </Box>
    </Box>
  );
};
