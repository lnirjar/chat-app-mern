import { useEffect } from "react";
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
import { useUpdateUsernameMutation } from "@/hooks/useUpdateUsernameMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";
import { isUsernameAvailable } from "@/api/userApi";

import { TOAST_MESSAGES } from "@/lib/constants";
import { debounceAsync } from "@/lib/utils";

const debouncedIsUsernameAvailable = debounceAsync(isUsernameAvailable, 500);

const formSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .trim()
    .min(1, { message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
      message:
        "Username must start with a letter and can only contain letters, numbers, and underscores",
    })
    .refine(async (username) => {
      const result = await debouncedIsUsernameAvailable(username);
      return result;
    }, "An user with this username already exists"),
});

export type UpdateUsernameFormData = z.infer<typeof formSchema>;

export const UpdateUsernameForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useUpdateUsernameMutation();

  const form = useForm<UpdateUsernameFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !mutation.isPending) {
      form.reset({
        username: user?.username || "",
      });
    }
  }, [
    form.formState.isSubmitSuccessful,
    mutation.isPending,
    form,
    user?.username,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        dispatch(authActions.updateUser({ username: data.data.user.username }));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.UPDATE_USERNAME_LOADING,
      success: TOAST_MESSAGES.UPDATE_USERNAME_SUCCESS,
      error: TOAST_MESSAGES.UPDATE_USERNAME_ERROR,
    });
  }

  return (
    <div className="my-8">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="john" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isDirty}
                >
                  Save
                </Button>
                <Button
                  type="reset"
                  variant="outline"
                  disabled={mutation.isPending || !form.formState.isDirty}
                  onClick={() => form.reset()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
