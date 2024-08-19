"use client";
import Image from "next/image";
import "./UploadCard.css";
import React from "react";

const UploadCard = ({ file, setFiles, index }) => {
  //   validate tag and title
  const validate = ({ title, tags }) => {
    const errors = {};
    if (title.length > 100) {
      errors.title = "title is too long";
    } else {
      errors.title = "";
    }
    if (tags.length > 5) {
      errors.tags = "tags is too long";
    } else {
      errors.tags = "";
    }

    return errors?.title || errors.tags ? "error" : "success";
  };

  //   change title image
  const handleChangeTitle = (e) => {
    const { value } = e.target;
    const newFile = {
      ...file,
      title: value,
      status: validate({ title: value, tags: file?.tags }),
    };
    setFiles((files) => files.map((item, i) => (i === index ? newFile : item)));
  };

  //   add tag
  const handleInputTags = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      let tag = e.target.value
        .trim()
        .replaceAll(/\s+/g, " ")
        .replaceAll(",", "");
      if (tag.length > 1 && !file?.tags?.includes(tag)) {
        const newFile = {
          ...file,
          tags: [...file.tags, tag],
          status: validate({ title: file.title, tags: [...file.tags, tag] }),
        };

        setFiles((files) =>
          files.map((item, i) => (i === index ? newFile : item))
        );
        e.target.value = "";
      }
    }
  };
  //remove tag
  const handleRemoveTag = (tag) => {
    const newTags = file.tags.filter((t) => t !== tag);

    const newFile = {
      ...file,
      tags: newTags,
      status: validate({ title: file.title, tags: newTags }),
    };

    setFiles((files) => files.map((item, i) => (i === index ? newFile : item)));
  };
  //Chang public
  const handleChangePublic = () => {
    setFiles((files) =>
      files.map((item, i) =>
        i === index ? { ...file, public: !file.public } : item
      )
    );
  };

  //   remove Card file
  const handleRemoveFile = () => {
    setFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className={`upload_card ${file?.status}`}>
      <Image
        src={file?.imageUrl}
        alt={file?.title || ""}
        width={280}
        height={280}
        title={file?.title}
      />

      {file?.message ? (
        <div className="up_c_error_box">
          <h4>{file?.status}</h4>
          <span>{file?.message}</span>
        </div>
      ) : (
        <div className="up_c_success_box">
          <div className="up_c_s_title" title={`${file?.title?.length} / 100`}>
            <input
              type="text"
              autoComplete="off"
              placeholder="Add a title"
              defaultValue={file?.title}
              onChange={handleChangeTitle}
            />
          </div>
          <div className="up_c_s_tags" title={`${file?.tags?.length} / 5`}>
            {file?.tags?.map((tag, index) => {
              return (
                <div key={index}>
                  <p> {tag}</p>
                  <i
                    className="material-symbols-outlined"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    close
                  </i>
                </div>
              );
            })}
            <input type="text" autoComplete="off" onKeyUp={handleInputTags} />
          </div>
          <label className="up_c_s_public">
            <input
              type="checkbox"
              checked={file?.public}
              onChange={handleChangePublic}
            />
            <span>Make photo public</span>
            <i className="material-symbols-outlined">lock</i>
          </label>
        </div>
      )}
      <button className="up_c_btn_close" onClick={handleRemoveFile}>
        <i className="material-symbols-outlined">close</i>
      </button>
    </div>
  );
};

export default UploadCard;
