export const validFiles = (file) => {
  const imgTypes = ["image/jpeg", "image/png","image/jpg"];
  if (!file.type.startsWith("image")) {
    return {
      status: "error",
      message: `This is not an image - ${file.type}`,
      title: file.name,
      imageUrl: "/empty.jpg",
    };
  }
  if (!imgTypes.includes(file.type)) {
    return {
      status: "error",
      message: `This image format is incorrect`,
      title: file.name,
      imageUrl: URL.createObjectURL(file),
    };
  }
  if (file.size > 1024 * 1024) {
    return {
      status: "error",
      message: `This image size is larger than 1mb`,
      title: file.name,
      imageUrl: URL.createObjectURL(file),
    };
  }

  return {
    status: "success",
    title: file.name.replace(/.(jpeg|jpg|png)$/gi, ""),
    tags: ["chell"],
    public: false,
    imageUrl: URL.createObjectURL(file),
    fileUpload: file,
  };
};
