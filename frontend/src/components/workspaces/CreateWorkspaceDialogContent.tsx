import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "@/components/workspaces/CreateWorkspaceForm";

export function CreateWorkspaceDialogContent() {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Workspace</DialogTitle>
      </DialogHeader>
      <CreateWorkspaceForm />
    </DialogContent>
  );
}
