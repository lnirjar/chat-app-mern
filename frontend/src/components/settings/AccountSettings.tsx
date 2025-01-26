import { Separator } from "@/components/ui/separator";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { DeleteAccountForm } from "./DeleteAccountForm";

export const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3>Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings
        </p>
      </div>
      <Separator />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
};
