import { Separator } from "@/app/components/ui/separator";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { CustomAPIKey } from "@/app/(main)/[locale]/(account)/settings/custom-api-key";

export default function Page() {
  return (
    <>
      <div className="flex flex-col ">
        <h2 className="text-2xl font-medium tracking-tight dark:text-neutral-100">
          Settings
        </h2>
        <div className="text-muted-foreground dark:text-neutral-400">
          Under Construction
        </div>
        <div className="flex flex-col gap-6 my-8 ">
          <div className="gap-2 flex flex-col ">
            <h3 className="text-lg font-medium">AI Preference</h3>
            <p className="text-sm text-muted-foreground dark:text-neutral-400">
              <CustomAPIKey />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
