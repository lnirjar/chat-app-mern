import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "@/components/workspaces/CreateWorkspaceForm";

export function CreateWorkspaceDialogContent({
  setOpen,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Workspace</DialogTitle>
      </DialogHeader>
      <CreateWorkspaceForm setOpen={setOpen} />
    </DialogContent>
  );
}
