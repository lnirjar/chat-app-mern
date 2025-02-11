import { Separator } from "@/components/ui/separator";
import { UpdateNameForm } from "@/components/settings/UpdateNameForm";
import { UpdateEmailForm } from "@/components/settings/UpdateEmailForm";
import { UpdateUsernameForm } from "@/components/settings/UpdateUsernameForm";
import { UpdateAvatarForm } from "@/components/settings/UpdateAvatarForm";

export const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site
        </p>
      </div>
      <Separator />
      <UpdateAvatarForm />
      <UpdateNameForm />
      <UpdateEmailForm />
      <UpdateUsernameForm />
    </div>
  );
};
