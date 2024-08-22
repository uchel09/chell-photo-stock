import Image from "next/image";
import "./Edit.css";

import React, { useRef, useState } from "react";
import { validFiles } from "@/utils/validFiles";
import toast from "react-hot-toast";
import { updateUser } from "@/actions/userAction";

const ProfileEdit = ({ user, setIsEdit }) => {
  const [file, setFile] = useState();
  const [name, setName] = useState(user?.name);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const handleInputFiles = (files) => {
    if (!files.length) return;
    [...files].map((file) => {
      const result = validFiles(file);
      if (result?.message) {
        return toast.error(result?.message);
      }
      setFile(result);
    });

    formRef.current.reset();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const data = e.dataTransfer;
    handleInputFiles(data.files);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (file) {
      formData.append("files", file.fileUpload);
      URL.revokeObjectURL(file.imageUrl);
    }

    const res = await updateUser({ formData, name, user });

    setLoading(false);
    if (res?.message) {
      toast.error(res?.message);
      setIsEdit(false);
    }
    if (res?.successMessage) {
      toast.success(res?.successMessage);
    }
  };

  return (
    <form
      className="profile_edit"
      ref={formRef}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onSubmit={handleUpdateUser}
    >
      <div className="p_e_container">
        <label htmlFor="upload" className="avatar">
          <Image
            src={file?.imageUrl || user?.avatar}
            alt={name}
            width={140}
            height={140}
            sizes="50vw"
          />
          <input
            type="file"
            id="upload"
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={(e) => handleInputFiles(e.target.files)}
          />
        </label>

        <div className="p_e_text">
          <input type="text" defaultValue={user?.email} disabled={true} />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      <button className="btn_submit_second" disabled={loading}>
        {loading ? "Loading..." : "Upload"}
      </button>
    </form>
  );
};

export default ProfileEdit;
