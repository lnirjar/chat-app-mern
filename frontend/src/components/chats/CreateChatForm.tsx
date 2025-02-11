import { useEffect } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

import { useAppDispatch, useAppSelector } from "@/hooks/react-redux-hooks";
import { useCreateChatMutation } from "@/hooks/useCreateChatMutation";
import { chatActions } from "@/slices/chatSlice";
import { ApiError } from "@/config/axios";

import { GROUP, TOAST_MESSAGES } from "@/lib/constants";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Chat name is required" })
    .max(30, { message: "Chat name must contain max 30 characters" }),
});

export type CreateChatFormData = z.infer<typeof formSchema>;

export const CreateChatForm = ({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const currentWorkspace = useAppSelector(
    (state) => state.workspace.currentWorkspace,
  );
  const mutation = useCreateChatMutation();

  const navigate = useNavigate();

  const form = useForm<CreateChatFormData>({
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
    const result = mutation.mutateAsync(
      {
        ...values,
        chatType: GROUP,
        workspaceId: currentWorkspace?._id.toString() as string,
      },
      {
        onSuccess: (data) => {
          const chat = data.data.chat;
          dispatch(chatActions.addChat(chat));
          setOpen(false);
          navigate(`/chats/${chat._id}`);
        },
        onError: (error: ApiError) => {
          console.error(error);
        },
      },
    );

    toast.promise(result, {
      loading: TOAST_MESSAGES.CREATE_CHAT_LOADING,
      success: TOAST_MESSAGES.CREATE_CHAT_SUCCESS,
      error: TOAST_MESSAGES.CREATE_CHAT_ERROR,
    });
  }

  if (!currentWorkspace) {
    return <div>First select a workspace</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat Name</FormLabel>
              <FormControl>
                <Input placeholder="Chat" {...field} />
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
