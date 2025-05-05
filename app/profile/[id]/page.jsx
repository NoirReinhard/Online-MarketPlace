import React from "react";
import EditableUserInfo from "@/app/components/EditableUserInfo";
import { User } from "@/app/models/User";

const profile = async ({ params }) => {
  const { id } = params;
  const user = await User.findById(id);
  const serializedUser = {
    ...user.toObject(),
    _id: user._id.toString(),
  };

  return <EditableUserInfo user={serializedUser} />;
};

export default profile;
