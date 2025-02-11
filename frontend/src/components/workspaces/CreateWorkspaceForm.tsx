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

import { useAppDispatch } from "@/hooks/react-redux-hooks";
import { useCreateWorkspaceMutation } from "@/hooks/useCreateWorkspaceMutation";
import { workspaceActions } from "@/slices/workspaceSlice";
import { ApiError } from "@/config/axios";

import { TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Workspace name is required" })
    .max(30, { message: "Workspace name must contain max 30 characters" }),
});

export type CreateWorkspaceFormData = z.infer<typeof formSchema>;

export const CreateWorkspaceForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const mutation = useCreateWorkspaceMutation();

  const form = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && !mutation.isPending) {
      form.reset({
        name: "",
      });
    }
  }, [form.formState.isSubmitSuccessful, mutation.isPending, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const result = mutation.mutateAsync(values, {
      onSuccess: (data) => {
        const workspace = data.data.workspace;
        dispatch(workspaceActions.addWorkspace(workspace));
        setOpen(false);
      },
      onError: (error: ApiError) => {
        console.error(error);
      },
    });

    toast.promise(result, {
      loading: TOAST_MESSAGES.CREATE_WORKSPACE_LOADING,
      success: TOAST_MESSAGES.CREATE_WORKSPACE_SUCCESS,
      error: TOAST_MESSAGES.CREATE_WORKSPACE_ERROR,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input placeholder="Workspace" {...field} />
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
  );
};
