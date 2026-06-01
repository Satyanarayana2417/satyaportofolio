export const CLOUDINARY_CLOUD_NAME = "dzlssgfz9";
export const CLOUDINARY_UPLOAD_PRESET = "My porto";

export type CloudinaryAsset = {
  url: string;
  publicId: string;
  type: "image" | "video" | "raw";
  width?: number;
  height?: number;
  format?: string;
  originalFilename?: string;
};

export async function uploadToCloudinary(file: File): Promise<CloudinaryAsset> {
  const isVideo = file.type.startsWith("video/");
  const resourceType: "image" | "video" = isVideo ? "video" : "image";
  return uploadAs(file, resourceType);
}

export async function uploadRawToCloudinary(file: File): Promise<CloudinaryAsset> {
  return uploadAs(file, "raw");
}

async function uploadAs(
  file: File,
  resourceType: "image" | "video" | "raw"
): Promise<CloudinaryAsset> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: form }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    type: resourceType,
    width: data.width,
    height: data.height,
    format: data.format,
    originalFilename: data.original_filename,
  };
}
