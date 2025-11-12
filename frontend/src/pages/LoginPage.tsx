import { Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserIcon } from "lucide-react";

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

import { CodeBlock } from "@/components/landing/code-block";

import { useLoginMutation } from "@/hooks/useLoginMutation";
import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";

import { APP_NAME, TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  usernameOrEmail: z
    .string({ message: "Username or Email is required" })
    .trim()
    .min(1, { message: "Username or Email is required" })
    .max(30, { message: "Should contain max 30 characters" }),
  password: z
    .string({ message: "Password is required" })
    .min(1, { message: "Password is required" })
    .max(20, { message: "Password must contain max 20 characters" }),
});

export type LoginFormData = z.infer<typeof formSchema>;

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const mutation = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        window.location.reload();
        dispatch(authActions.setUser(data.data.user));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.LOGIN_LOADING,
      success: TOAST_MESSAGES.LOGIN_SUCCESS,
      error: (error: ApiError) => {
        let message = TOAST_MESSAGES.ERROR_SOMETHING_WENT_WRONG;
        if (error.response?.status === 404) {
          message = TOAST_MESSAGES.LOGIN_ERROR_USERNAME_EMAIL_NOT_FOUND;
        }
        if (error.response?.status === 401) {
          message = TOAST_MESSAGES.LOGIN_ERROR_INVALID_PASSWORD;
        }
        return message;
      },
    });
  }

  if (user) {
    const redirectPath = location.state ? location.state.path : "/";
    return (
      <Navigate
        to={redirectPath}
        state={{ path: location.pathname }}
        replace={true}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Login | {APP_NAME}</title>
      </Helmet>

      <div className="w-96 mx-auto my-8">
        <section className="flex flex-col gap-1 max-w-sm my-4">
          <h3 className="text-xl font-medium flex items-center gap-2">
            <UserIcon /> Demo User
          </h3>
          <CodeBlock code={`Username: demo \nPassword: abc123`} />
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your email below to login</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="usernameOrEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username or Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" disabled={mutation.isPending}>
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
