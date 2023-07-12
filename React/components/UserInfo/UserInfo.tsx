import React from "react";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import { UserInfoProps } from ".";

export const UserInfo: React.FC<UserInfoProps> = ({
  imageUrl,
  name,
  gender,
  city,
  state,
  phoneNumber,
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{ cursor: "pointer" }}
    >
      <Stack direction="row">
        <Avatar sx={{ width: 56, height: 56 }} src={imageUrl} />
        <Box ml={1}>
          <Typography variant="h6">{name}</Typography>
          <Chip label={gender} size="small" />
        </Box>
      </Stack>
      <Stack>
        <Typography variant="bodyLarge">{`${city}, ${state}`}</Typography>
        <Typography variant="bodySmall" align='right'>{phoneNumber}</Typography>
      </Stack>
    </Stack>
  );
};
