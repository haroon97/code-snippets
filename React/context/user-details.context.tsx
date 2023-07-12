import { createContext, useMemo, useState } from "react";
import { User, UserDetailsContextProps } from "./user-details.context.types";

export const UserDetailsContext = createContext<UserDetailsContextProps>({} as UserDetailsContextProps);

export const UserDetailsProvider = ({ children }: any) => {
  const [users, setUsers] = useState([] as User[]);

  const value = useMemo(() => {
    return {
      users,
      setUsers,
    };
  }, [users]);

  return (
    <UserDetailsContext.Provider value={value}>
      {children}
    </UserDetailsContext.Provider>
  );
};
