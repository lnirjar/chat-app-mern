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
import { useUpdateNameMutation } from "@/hooks/useUpdateNameMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";

import { TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(30, { message: "Name must contain max 30 characters" }),
});

export type UpdateNameFormData = z.infer<typeof formSchema>;

export const UpdateNameForm = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const mutation = useUpdateNameMutation();

  const form = useForm<UpdateNameFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !mutation.isPending) {
      form.reset({
        name: user?.name || "",
      });
    }
  }, [form.formState.isSubmitSuccessful, mutation.isPending, form, user?.name]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        dispatch(authActions.updateUser({ name: data.data.user.name }));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.UPDATE_NAME_LOADING,
      success: TOAST_MESSAGES.UPDATE_NAME_SUCCESS,
      error: TOAST_MESSAGES.UPDATE_NAME_ERROR,
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
