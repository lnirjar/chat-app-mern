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
import { useUpdateEmailMutation } from "@/hooks/useUpdateEmailMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";
import { isEmailAvailable } from "@/api/userApi";

import { TOAST_MESSAGES } from "@/lib/constants";
import { debounceAsync } from "@/lib/utils";

const debouncedIsEmailAvailable = debounceAsync(isEmailAvailable, 500);

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email()
    .refine(async (email) => {
      const result = await debouncedIsEmailAvailable(email);
      return result;
    }, "An user with this email already exists"),
});

export type UpdateEmailFormData = z.infer<typeof formSchema>;

export const UpdateEmailForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useUpdateEmailMutation();

  const form = useForm<UpdateEmailFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !mutation.isPending) {
      form.reset({
        email: user?.email || "",
      });
    }
  }, [
    form.formState.isSubmitSuccessful,
    mutation.isPending,
    form,
    user?.email,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        dispatch(authActions.updateUser({ email: data.data.user.email }));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.UPDATE_EMAIL_LOADING,
      success: TOAST_MESSAGES.UPDATE_EMAIL_SUCCESS,
      error: TOAST_MESSAGES.UPDATE_EMAIL_ERROR,
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@example.com" {...field} />
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
