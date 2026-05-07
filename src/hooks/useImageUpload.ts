import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";

interface CaptureUploadResult {
  url: string;
  nid: string;
  fileName: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadWithCapture = async (file: File): Promise<CaptureUploadResult | null> => {
    if (!user) return null;

    setUploading(true);
    try {
      // Get the user's session token
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Call the edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/register-capture-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload and register image");
      }

      const result = await response.json();
      return {
        url: result.url,
        nid: result.nid,
        fileName: result.fileName,
      };
    } catch (error) {
      console.error("Error uploading with Capture:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploadWithCapture, uploading };
};
