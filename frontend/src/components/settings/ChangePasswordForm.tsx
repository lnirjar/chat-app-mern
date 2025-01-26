import { useEffect } from "react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { useChangePasswordMutation } from "@/hooks/useChangePasswordMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";

import { TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z
  .object({
    password: z
      .string({ message: "Current Password is required" })
      .min(1, { message: "Current Password is required" })
      .max(20, { message: "Current Password must contain max 20 characters" }),
    newPassword: z
      .string()
      .min(1, { message: "New Password is required" })
      .min(6, { message: "New Password must contain atleast 6 characters" })
      .max(20, { message: "New Password must contain max 20 characters" })
      .regex(/^\S+$/, {
        message: "New Password should not contain any whitespace",
      }),
    confirmNewPassword: z
      .string()
      .min(1, { message: "Confirm New Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"], // Set the path to point to confirmNewPassword
  });

export type ChangePasswordFormData = z.infer<typeof formSchema>;

export const ChangePasswordForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useChangePasswordMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (
      form.formState.isSubmitSuccessful &&
      !mutation.isPending &&
      mutation.isSuccess
    ) {
      form.reset();
    }
  }, [
    form.formState.isSubmitSuccessful,
    mutation.isPending,
    mutation.isSuccess,
    form,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        dispatch(
          authActions.updateUser({
            lastPasswordChange: data.data.user.lastPasswordChange,
          }),
        );
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.CHANGE_PASSWORD_LOADING,
      success: TOAST_MESSAGES.CHANGE_PASSWORD_SUCCESS,
      error: (error: ApiError) => {
        let message = TOAST_MESSAGES.ERROR_SOMETHING_WENT_WRONG;
        if (error.response?.status === 401) {
          message = TOAST_MESSAGES.CHANGE_PASSWORD_ERROR_INVALID_PASSWORD;
        }
        return message;
      },
    });
  }

  return (
    <div className="my-8">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          {user?.lastPasswordChange && (
            <CardDescription>
              Your password was last changed{" "}
              {formatDistanceToNow(new Date(user?.lastPasswordChange), {
                addSuffix: true,
              })}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Current Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="New Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Confirm New Password"
                        type="password"
                        {...field}
                      />
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
