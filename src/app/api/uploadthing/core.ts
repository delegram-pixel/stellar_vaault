import { createUploadthing, type FileRouter } from "uploadthing/next";

 
const f = createUploadthing();
 

 
export const ourFileRouter = {
  // For uploading profile pictures
  profilePicture: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile picture upload completed", metadata, file);
      return { uploadedBy: metadata };
    }),

  // For uploading multiple images
  multipleImages: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
  
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload completed", metadata, file);
      return { uploadedBy: metadata };
    }),

  // For uploading PDFs
  pdfUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
   
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("PDF upload completed", metadata, file);
      return { uploadedBy: metadata.userId };
    }),

  // For uploading multiple file types
  mediaPost: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    text: { maxFileSize: "1MB", maxFileCount: 1 },
  })
   
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Media upload completed", metadata, file);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;
