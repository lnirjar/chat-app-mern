import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { useUpdateAvatarMutation } from "@/hooks/useUpdateAvatarMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";

import { TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  avatar: z
    .instanceof(File, { message: "Avatar is required" })
    .refine((file) => file.size < 10000000, {
      message: "Image must be less than 10MB",
    }),
});

export type UpdateAvatarFormData = z.infer<typeof formSchema>;

export const UpdateAvatarForm = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useUpdateAvatarMutation();

  const form = useForm<UpdateAvatarFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Files cannot be sent using JSON (application/json) or plain text (text/plain) encoding.
    // Instead, they require multipart/form-data encoding.
    // FormData objects automatically handle the correct formatting and encoding required for multipart/form-data requests.
    // This includes setting the proper boundaries between form fields and encoding each part appropriately.
    const formData = new FormData();
    formData.append("avatar", values.avatar);

    const result = mutation.mutateAsync(formData, {
      onSuccess: (data) => {
        dispatch(authActions.updateUser({ avatar: data.data.user.avatar }));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.UPDATE_AVATAR_LOADING,
      success: TOAST_MESSAGES.UPDATE_AVATAR_SUCCESS,
      error: TOAST_MESSAGES.UPDATE_AVATAR_ERROR,
    });
  }

  return (
    <div className="my-8">
      <Card>
        <CardContent className="pt-6 flex flex-col items-start sm:flex-row gap-6">
          <div className="w-40 h-40 flex-shrink-0">
            {user?.avatar ? (
              <img
                src={preview ? preview : user.avatar}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-500"></div>
            )}
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={(_event) => {
                  form.reset();
                  setSelectedFile(null);
                }}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="avatar"
                  // https://github.com/shadcn-ui/ui/discussions/2137
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file =
                              event.target.files && event.target.files[0];
                            onChange(file);
                            setSelectedFile(file);
                          }}
                          className="dark:file:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={mutation.isPending}>
                    Save
                  </Button>
                  <Button
                    type="reset"
                    variant="outline"
                    disabled={mutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
