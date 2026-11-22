"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import {
  createMenuItem,
  updateMenuItem,
  uploadMenuItemImages,
} from "@/lib/menu-items/actions";
import {
  MENU_ITEM_CATEGORIES,
  type CreateMenuItemInput,
  type MenuItem,
  type MenuItemCategory,
} from "@/lib/menu-items/types";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";

type MenuItemFormValues = Omit<
  CreateMenuItemInput,
  "images" | "price" | "category"
> & {
  category: MenuItemCategory | "";
  price: number;
  images: FileList | null;
};

type MenuItemFormProps = {
  mode?: "create" | "update";
  menuItemId?: string;
  defaultValues?: Partial<MenuItem>;
  /** Where to navigate after a successful save or cancel. */
  returnTo?: string;
};

const MAX_MENU_ITEM_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function MenuItemForm({
  mode = "create",
  menuItemId,
  defaultValues,
  returnTo,
}: MenuItemFormProps) {
  const router = useRouter();
  const isUpdate = mode === "update";
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const form = useForm<MenuItemFormValues>({
    defaultValues: {
      itemName: defaultValues?.itemName ?? "",
      category: defaultValues?.category ?? "",
      description: defaultValues?.description ?? "",
      price: defaultValues?.price ?? 0,
      location: defaultValues?.location ?? "",
      images: null,
    },
  });

  const existingImages = (defaultValues?.images ?? []).filter(
    (image) => !removedImages.includes(image),
  );

  async function onSubmit(values: MenuItemFormValues) {
    try {
      const newImageUrls = await uploadMenuItemImages(selectedImageFiles);
      const input: CreateMenuItemInput = {
        itemName: values.itemName.trim(),
        category: values.category as MenuItemCategory,
        description: values.description.trim(),
        price: values.price,
        location: values.location.trim(),
        images: [...existingImages, ...newImageUrls],
      };

      if (isUpdate) {
        if (!menuItemId) {
          throw new Error("A menu item id is required to update an item.");
        }

        await updateMenuItem(menuItemId, input);
      } else {
        await createMenuItem(input);
      }

      toast.add({
        title: isUpdate ? "Menu item updated" : "Menu item created",
        description: isUpdate
          ? "Your menu item was updated successfully."
          : "Your menu item was submitted for approval.",
        type: "success",
        timeout: 5000,
      });

      if (!isUpdate) {
        form.reset();
        setSelectedImageFiles([]);
      }

      if (returnTo) {
        router.push(returnTo);
      } else {
        router.refresh();
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save the menu item. Please try again.";
      const isUploadError = message
        .toLowerCase()
        .startsWith("image upload failed");

      toast.add({
        title: isUploadError
          ? "Image upload failed"
          : isUpdate
            ? "Update failed"
            : "Creation failed",
        description: message,
        type: "error",
      });
    }
  }

  const imageField = form.register("images", {
    validate: () => {
      const files = selectedImageFiles;

      if (!files.length && !existingImages.length) {
        return "Add at least one image.";
      }

      const totalImages = existingImages.length + files.length;

      if (totalImages > MAX_MENU_ITEM_IMAGES) {
        return `Choose up to ${MAX_MENU_ITEM_IMAGES} images.`;
      }

      const invalidFile = files.find((file) => !file.type.startsWith("image/"));

      if (invalidFile) {
        return `${invalidFile.name} is not a supported image file.`;
      }

      const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE);

      if (oversizedFile) {
        return `${oversizedFile.name} must be smaller than 5 MB.`;
      }

      return true;
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="max-w-2xl"
    >
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.itemName}>
          <FieldLabel htmlFor="itemName">Item name</FieldLabel>
          <Input
            id="itemName"
            placeholder="Margherita Pizza"
            aria-invalid={!!form.formState.errors.itemName}
            {...form.register("itemName", {
              required: "Enter an item name.",
              minLength: { value: 2, message: "Use at least 2 characters." },
            })}
          />
          <FieldError errors={[form.formState.errors.itemName]} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.category}>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Controller
              control={form.control}
              name="category"
              rules={{ required: "Choose a menu item category." }}
              render={({ field }) => (
                <Select
                  name={field.name}
                  value={field.value || null}
                  inputRef={field.ref}
                  onValueChange={(value) => field.onChange(value ?? "")}
                >
                  <SelectTrigger
                    id="category"
                    aria-invalid={!!form.formState.errors.category}
                    onBlur={field.onBlur}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MENU_ITEM_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[form.formState.errors.category]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.price}>
            <FieldLabel htmlFor="price">Price</FieldLabel>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="12.99"
              aria-invalid={!!form.formState.errors.price}
              {...form.register("price", {
                valueAsNumber: true,
                required: "Enter a price.",
                validate: (value) =>
                  Number.isFinite(value) || "Enter a valid price.",
                min: { value: 0, message: "Price cannot be negative." },
              })}
            />
            <FieldError errors={[form.formState.errors.price]} />
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.description}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            placeholder="Describe the ingredients and portion size."
            aria-invalid={!!form.formState.errors.description}
            {...form.register("description", {
              required: "Enter a description.",
              minLength: { value: 2, message: "Use at least 2 characters." },
            })}
          />
          <FieldError errors={[form.formState.errors.description]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.location}>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            placeholder="Dhanmondi, Dhaka"
            aria-invalid={!!form.formState.errors.location}
            {...form.register("location", {
              required: "Enter a location.",
            })}
          />
          <FieldError errors={[form.formState.errors.location]} />
        </Field>

        <Field data-invalid={!!form.formState.errors.images}>
          <FieldLabel htmlFor="images">Menu images</FieldLabel>

          {isUpdate && (defaultValues?.images?.length ?? 0) > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">
                  Current images ({existingImages.length})
                </p>
                {removedImages.length > 0 ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => setRemovedImages([])}
                  >
                    Restore all
                  </Button>
                ) : null}
              </div>

              {existingImages.length > 0 ? (
                <ul className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {existingImages.map((image, index) => (
                    <li
                      key={`${image}-${index}`}
                      className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <Image
                        src={image}
                        alt="Current menu item"
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        aria-label="Remove this image"
                        onClick={() =>
                          setRemovedImages((prev) => [...prev, image])
                        }
                        className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg border border-dashed bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                  All existing images will be removed. Add a new image below.
                </p>
              )}
            </div>
          ) : null}

          <Input
            id="images"
            type="file"
            accept="image/*"
            multiple
            aria-invalid={!!form.formState.errors.images}
            {...imageField}
            onChange={(event) => {
              imageField.onChange(event);
              const newFiles = Array.from(event.target.files ?? []);
              setSelectedImageFiles((prev) => [...prev, ...newFiles]);
              event.target.value = "";
            }}
          />
          <FieldDescription>
            {existingImages.length
              ? `${existingImages.length} current image${
                  existingImages.length === 1 ? "" : "s"
                }. `
              : ""}
            {selectedImageFiles.length
              ? `${selectedImageFiles.length} new image${
                  selectedImageFiles.length === 1 ? "" : "s"
                } selected. `
              : "No new images selected. "}
            Choose up to 5 images, each smaller than 5 MB.
          </FieldDescription>
          {selectedImageFiles.length > 0 ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="mb-2 text-sm font-medium text-foreground">
                Selected images ({selectedImageFiles.length})
              </p>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                {selectedImageFiles.map((file) => (
                  <li
                    key={file.name + file.lastModified}
                    className="truncate"
                  >
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <FieldError errors={[form.formState.errors.images]} />
        </Field>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Saving..."
              : isUpdate
                ? "Update menu item"
                : "Create menu item"}
          </Button>
          {returnTo && (
            <Button
              type="button"
              variant="outline"
              disabled={form.formState.isSubmitting}
              onClick={() => router.push(returnTo)}
            >
              Cancel
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
