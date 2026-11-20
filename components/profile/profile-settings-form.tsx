"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AlertCircleIcon,
  CameraIcon,
  CheckCircle2Icon,
  Loader2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { uploadProfileImage } from "@/lib/profile/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileSettingsFormProps = {
  initialName: string;
  image: string | null;
};

export function ProfileSettingsForm({
  initialName,
  image,
}: ProfileSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [currentImage, setCurrentImage] = useState(image);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);

    event.target.value = "";
    setError(null);
    setSuccess(null);
  }

  function clearSelectedFile() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedFile(null);
    setImagePreview(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const trimmedName = name.trim();

      if (!trimmedName) {
        throw new Error("Please enter your name.");
      }

      const data: { name?: string; image?: string | null } = {
        name: trimmedName,
      };

      if (selectedFile) {
        setIsUploading(true);

        try {
          data.image = await uploadProfileImage(selectedFile);
        } finally {
          setIsUploading(false);
        }
      }

      const result = await authClient.updateUser(data);

      if (result.error) {
        throw new Error(
          result.error.message ?? "Failed to update your profile.",
        );
      }

      if (data.image) {
        setCurrentImage(data.image);
      }

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setSelectedFile(null);
      setImagePreview(null);
      setSuccess("Your profile has been updated successfully.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  }

  const activeImage = imagePreview ?? currentImage;

  const hasChanges = name.trim() !== initialName || selectedFile !== null;

  return (
    <form
      onSubmit={handleSave}
      className="overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      {/* Header */}
      <div className="border-b px-5 py-5 sm:px-7">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              Profile information
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your personal details and profile photo.
            </p>
          </div>

          {hasChanges && (
            <span className="hidden rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Form content */}
      <div className="space-y-6 p-5 sm:p-7">
        {/* Profile photo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border bg-muted sm:size-28">
            {activeImage ? (
              <Image
                src={activeImage}
                alt="Profile photo"
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <CameraIcon className="size-8" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Profile photo</h3>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or WebP. Choose a photo that represents you.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  document.getElementById("profile-image")?.click()
                }
              >
                <UploadIcon className="size-4" />
                {selectedFile ? "Change photo" : "Upload photo"}
              </Button>

              {selectedFile && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={clearSelectedFile}
                >
                  <XIcon className="size-4" />
                  Remove
                </Button>
              )}
            </div>

            {selectedFile && (
              <p className="max-w-xs truncate text-xs text-muted-foreground">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Choose a profile photo"
          />
        </div>

        {/* Name */}
        <div className="max-w-md space-y-2">
          <Label htmlFor="profile-name">Display name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
              setSuccess(null);
            }}
            placeholder="Enter your name"
          />
          <p className="text-xs text-muted-foreground">
            This name will be visible to other users.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t bg-muted/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div className="min-h-5">
          {success && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2Icon className="size-4 shrink-0" />
              {success}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="flex items-center gap-2 text-sm text-destructive"
            >
              <AlertCircleIcon className="size-4 shrink-0" />
              {error}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSaving || !hasChanges}>
          {isSaving ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              {isUploading ? "Uploading photo..." : "Saving..."}
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  );
}
