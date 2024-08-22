import "./Follow.css";
import React from "react";
import { getUsers } from "@/actions/userAction";
import ErrorComponent from "@/components/ui/Error/Error";
import ListOfUsers from "../../ListOfUsers/ListOfUsers";
import Modal from "@/components/ui/Modal/Modal";

const ProfileFollow = async ({ id, page }) => {
  if (page !== "following" && page !== "follower") {
    return null;
  }

  const sort = "updatedAt";
  const res = await getUsers({ id, page, sort });

  return (
    <Modal url={`/profile/${id}`}>
      <div className="follow">
        <h1> List of {page}</h1>

        {res?.message ? (
          <ErrorComponent />
        ) : (
          <ListOfUsers
            data={res?.data}
            next_cursor={res?.next_cursor}
            fetchingData={getUsers}
            query={{ id, page, sort }}
          />
        )}
      </div>
    </Modal>
  );
};

export default ProfileFollow;
