"use client";

export const fileService = {
  viewFile: async (fileName) => {
    if (!fileName) {
      throw new Error("No file available");
    }

    if (/^https?:\/\//i.test(fileName)) {
      return fileName;
    }

    throw new Error("Unsupported file path");
  },
};

export default fileService;
