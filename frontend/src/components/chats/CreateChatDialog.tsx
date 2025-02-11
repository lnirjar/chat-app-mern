import { useState } from "react";
import { CirclePlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { CreateChatForm } from "@/components/chats/CreateChatForm";

export function CreateChatDialog() {
  const [open, setOpen] = useState(false);

  const handleOpenchange = (open: boolean) => {
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenchange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <CirclePlus />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>New Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chat</DialogTitle>
        </DialogHeader>
        <CreateChatForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
