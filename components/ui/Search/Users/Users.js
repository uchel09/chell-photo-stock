import { getUsers } from "@/actions/userAction";
import React from "react";
import ErrorComponent from "../../Error/Error";
import ListOfUsers from "../../ListOfUsers/ListOfUsers";

const SearchUsers = async ({ page, search }) => {
  if (page !== "users") return null;
  const res = await getUsers({ page, search });

  return (
    <>
      {res?.message ? (
        <ErrorComponent errMsg={res?.message} />
      ) : (
        <ListOfUsers
          data={res?.data}
          next_cursor={res?.next_cursor}
          fetchingData={getUsers}
          query={{ page, search }}
        />
      )}
    </>
  );
};

export default SearchUsers;
