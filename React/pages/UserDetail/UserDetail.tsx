import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";
import { Header } from "../../components/Header";
import { UserDetailsContext } from "../../context/user-details.context";
import { User } from "../../context/user-details.context.types";

export const UserDetails = () => {
  const theme = useTheme();
  const params = useParams();

  const { users } = useContext(UserDetailsContext);

  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    const selectedUser = users.find((user) => user.login.uuid === params.id);
    const isPresentInLocalStorage = localStorage.getItem("user") !== null;

    if (isPresentInLocalStorage) {
      const storedUser = localStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser as string);
      setUser(parsedUser);
    } else {
      localStorage.setItem("user", JSON.stringify(selectedUser));
      setUser(selectedUser);
    }
  }, [params.id, users]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      flex={1}
      height="100vh"
      overflow="hidden"
    >
      <Header />
      <Box
        bgcolor={theme.colors.surfaceBasic}
        borderRadius={3}
        marginX={3}
        my={2}
      >
        <Box ml={3} my={2} height="100%">
          <Typography variant="h5" color="primary.dark">
            User Details
          </Typography>
          <Box display="flex" flexDirection="column" mt={3}>
            <Typography
              variant="bodyMediumBold"
              color={theme.colors.highEmphasis}
            >
              Email
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.highEmphasis}>
              {user?.email}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" mt={3}>
            <Typography
              variant="bodyMediumBold"
              color={theme.colors.highEmphasis}
            >
              Country
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.highEmphasis}>
              {user?.location.country}
            </Typography>
          </Box>
          <Box display="flex" flexDirection="column" mt={3}>
            <Typography
              variant="bodyMediumBold"
              color={theme.colors.highEmphasis}
            >
              Address
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.highEmphasis}>
              {`${user?.location.street.number}, ${user?.location.street.name}`}
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" mt={3}>
            <Typography
              variant="bodyMediumBold"
              color={theme.colors.highEmphasis}
            >
              Age
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.highEmphasis}>
              {user?.dob.age}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
