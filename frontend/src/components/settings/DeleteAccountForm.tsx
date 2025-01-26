import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useAppDispatch } from "@/hooks/react-redux-hooks";
import { useDeleteAccountMutation } from "@/hooks/useDeleteAccountMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";

import { TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  password: z
    .string()
    .max(20, { message: "Password must contain max 20 characters" }),
});

export type DeleteAccountFormData = z.infer<typeof formSchema>;

export const DeleteAccountForm = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const mutation = useDeleteAccountMutation();

  const form = useForm<DeleteAccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
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
    setOpen(false);
    const result = mutation.mutateAsync(values, {
      onSuccess: (_data) => {
        dispatch(authActions.setUser(null));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.DELETE_ACCOUNT_LOADING,
      success: TOAST_MESSAGES.DELETE_ACCOUNT_SUCCESS,
      error: (error: ApiError) => {
        let message = TOAST_MESSAGES.ERROR_SOMETHING_WENT_WRONG;
        if (error.response?.status === 401) {
          message = TOAST_MESSAGES.DELETE_ACCOUNT_ERROR_INVALID_PASSWORD;
        }
        return message;
      },
    });
  }

  return (
    <div className="my-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Delete Account</CardTitle>
          <CardDescription>
            Enter your password to delete your account and all associated
            information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (form.formState.isDirty) setOpen(true);
              }}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={mutation.isPending || !form.formState.isDirty}
                  >
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="border-b-0">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={buttonVariants({ variant: "destructive" })}
                      disabled={mutation.isPending || !form.formState.isDirty}
                      onClick={form.handleSubmit(onSubmit)}
                    >
                      Yes, delete account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
