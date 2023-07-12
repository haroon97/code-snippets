import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  styled,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { AppBanner } from "../../components/AppBanner";
import { UserInfo } from "../../components/UserInfo";
import { ApiError } from "../../components/ApiError";
import { Loader } from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { UserDetailsContext } from "../../context/user-details.context";
import { User } from "../../context/user-details.context.types";

const RoundedTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 100,
  },
}));

export const Home: React.FC = () => {
  const [page, setPage] = useState(1);

  const { setUsers } = useContext(UserDetailsContext);

  const navigate = useNavigate();

  const fetchUsers = async (page: number) => {
    const res = await fetch(
      `https://randomuser.me/api/?page=${page}&results=10&seed=abc`
    );
    return res.json();
  };

  const { isLoading, isError, data, refetch } = useQuery(
    ["users", page],
    () => fetchUsers(page),
    {
      keepPreviousData: true,
    }
  );
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  useEffect(() => {
    if (data) {
      setUsers(data.results);
      setFilteredUsers(data.results);
    }
  }, [data, setUsers]);

  const onSearchUser = (searchQuery: string) => {
    const filteredData = data?.results?.filter((user: User) => {
      const fullName = `${user.name.first} ${user.name.last}`;
      return fullName.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredUsers(filteredData);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <ApiError refreshData={refetch} />;
  }

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <AppBanner message="My Dashboard" />
      <Box marginX={2} marginTop={3}>
        <RoundedTextField
          fullWidth
          placeholder="Search users"
          size="small"
          variant="outlined"
          onChange={(e) => onSearchUser(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Box marginTop={3}>
          {filteredUsers.map((user: User) => (
            <Box
              marginY={3}
              onClick={() => navigate(`/user/${user.login.uuid}`)}
              key={user.login.uuid}
            >
              <UserInfo
                imageUrl={user.picture.thumbnail}
                name={`${user.name.first} ${user.name.last}`}
                gender={user.gender}
                city={user.location.city}
                state={user.location.state}
                phoneNumber={user.phone}
              />
            </Box>
          ))}
        </Box>
        {filteredUsers.length >= 10 && (
          <Stack direction="row" justifyContent="flex-end" marginBottom={2}>
            <Button
              size="medium"
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => setPage((prevState) => Math.max(prevState - 1, 0))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              size="medium"
              variant="contained"
              onClick={() => setPage((prevState) => prevState + 1)}
            >
              Next
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  );
};
