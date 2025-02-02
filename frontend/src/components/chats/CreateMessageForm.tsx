import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { SEND_MESSAGE } from "@/lib/constants";
import { socket } from "@/config/socket";

const formSchema = z.object({
  text: z.string().trim().min(1, { message: "Text is required" }),
});

export type CreateMessageFormData = z.infer<typeof formSchema>;

export const CreateMessageForm = () => {
  const params = useParams<{ chatId: string }>();

  const form = useForm<CreateMessageFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        text: "",
      });
    }
  }, [form.formState.isSubmitSuccessful, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    socket.emit(SEND_MESSAGE, { chatId: params.chatId, text: values.text });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-2 items-center">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="bg-gray-300 dark:bg-muted"
                    placeholder="Message"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size="icon" disabled={!form.formState.isDirty}>
            <SendHorizonal />
          </Button>
        </div>
      </form>
    </Form>
  );
};
