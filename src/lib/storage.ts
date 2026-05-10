import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Converts an image File to WebP format using Canvas to save space.
 */
export const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Limit max dimension to 1920px for performance/storage balance
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1920;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("WebP conversion failed"));
          },
          "image/webp",
          0.8 // 80% quality is a sweet spot for size/clarity
        );
      };
      img.onerror = () => reject(new Error("Image loading failed"));
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads an image to Firebase Storage after converting to WebP.
 */
export const uploadJobImage = async (jobId: string, file: File): Promise<string> => {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized. Check your Firebase configuration.");
  }
  
  const webpBlob = await convertToWebP(file);
  const fileName = `img_${Date.now()}.webp`;
  const storageRef = ref(storage, `jobs/${jobId}/${fileName}`);
  
  const metadata = {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=31536000',
  };
  
  await uploadBytes(storageRef, webpBlob, metadata);
  return getDownloadURL(storageRef);
};

/**
 * Uploads a decorator business logo to Firebase Storage.
 */
export const uploadDecoratorLogo = async (userId: string, file: File): Promise<string> => {
  if (!storage) {
    throw new Error("Firebase Storage is not initialized.");
  }
  
  // We'll keep logos as original format or WebP? Let's use WebP to be consistent.
  const webpBlob = await convertToWebP(file);
  const storageRef = ref(storage, `users/${userId}/logo.webp`);
  
  const metadata = {
    contentType: 'image/webp',
    cacheControl: 'public,max-age=31536000',
  };
  
  await uploadBytes(storageRef, webpBlob, metadata);
  return getDownloadURL(storageRef);
};
