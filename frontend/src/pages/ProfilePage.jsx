import React from "react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();

  return <div>Profile</div>;
};

export default ProfilePage;
