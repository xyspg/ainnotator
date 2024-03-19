import { Separator } from "@/app/components/ui/separator";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { CustomAPIKey } from "@/app/(main)/[locale]/(account)/settings/custom-api-key";
import { CustomPrompt } from "@/app/(main)/[locale]/(account)/settings/custom-prompt";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {getTranslations} from "next-intl/server";

export const dynamic = 'force-dynamic'

export default async function Page() {
  const s = createClient(cookies());
  const {
    data: { user },
  } = await s.auth.getUser();
  const { data: userPrompt } = await s
    .from("users")
    .select("custom_prompt")
    .eq("id", user?.id)
    .single();
  const prompt = userPrompt?.custom_prompt;
  const t = await getTranslations('Settings')
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
            <h3 className="text-lg font-medium">{t('ai_preference')}</h3>
            <div className="text-sm text-muted-foreground dark:text-neutral-400 flex flex-col gap-4 ">
              <CustomAPIKey />
              <CustomPrompt prompt={prompt} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
