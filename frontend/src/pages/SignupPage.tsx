import { Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { useSignupMutation } from "@/hooks/useSignupMutation";
import { authActions } from "@/slices/authSlice";
import { ApiError } from "@/config/axios";
import { isEmailAvailable } from "@/api/userApi";

import { TOAST_MESSAGES } from "@/lib/constants";
import { cacheLastResult, debounceAsync } from "@/lib/utils";

const debouncedCachedIsEmailAvailable = debounceAsync(
  cacheLastResult(isEmailAvailable),
  500,
);

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(30, { message: "Name must contain max 30 characters" }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email is required" })
      .email()
      .refine(async (email) => {
        const result = await debouncedCachedIsEmailAvailable(email);
        return result;
      }, "An user with this email already exists"),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must contain atleast 6 characters" })
      .max(20, { message: "Password must contain max 20 characters" })
      .regex(/^\S+$/, {
        message: "Password should not contain any whitespace",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // Set the path to point to confirmPassword
  });

export type SignupFormData = z.infer<typeof formSchema>;

export const SignupPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  const mutation = useSignupMutation();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        dispatch(authActions.setUser(data.data.user));
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.SIGNUP_LOADING,
      success: TOAST_MESSAGES.SIGNUP_SUCCESS,
      error: TOAST_MESSAGES.ERROR_SOMETHING_WENT_WRONG,
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
        <title>Signup | Chat App</title>
      </Helmet>
      <div className="w-96 mx-auto my-8">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Confirm Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
