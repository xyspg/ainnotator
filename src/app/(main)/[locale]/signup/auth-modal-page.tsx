"use client";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { nanoid } from "nanoid";
import { useRefererStore } from "@/app/store";
import { useEffect } from "react";
import { randomNanoID } from "@/lib/utils";

export default function AuthModalPage() {
    const supabase = createClient();
    const searchParams = useSearchParams();
    const refererCode = searchParams.get("r");
    const setRefererCode = useRefererStore((state) => state.updateReferer);

    useEffect(() => {
        if (refererCode) {
            setRefererCode(refererCode);
        }

    }, []);

    const redirectUrl = refererCode ? `https://ainnotator.com/?r=${refererCode}` : `https://ainnotator.com`;
    console.log("Redirect URL --->",redirectUrl)


    return (
        <div className="m-6 flex justify-center items-center">
            <Toaster />
            <div className="w-full overflow-hidden shadow-xl md:max-w-3xl md:rounded-2xl md:border md:border-gray-200">
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="w-full md:w-1/2 bg-white p-4 flex flex-col justify-center items-center">
                        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 pb-6 text-center md:px-16">
                            {/*<SpeechBubble size={100} mood="excited" color="#83D1FB" />*/}
                            <h3 className="font-display text-2xl font-bold">
                                登录 AInnotator
                            </h3>
                            <p className="text-sm text-slate-400">
                                新用户登录即送 50 次 AI 批注
                            </p>
                            {refererCode && <p className="text-sm">你已被邀请，可再获得 50 免费次数</p>}
                        </div>
                        <p className="py-6 text-center text-sm text-slate-400">
                            点击登录或注册，即同意{" "}
                            <Link
                                data-umami-event="click_terms_from_signin"
                                href="/legal/terms"
                                target="_blank"
                                className="group underline"
                                aria-label="服务条款"
                            >
                                服务条款
                            </Link>{" "}
                            和{" "}
                            <Link
                                data-umami-event="click_privacy_policy_from_signin"
                                href="/legal/privacy"
                                target="_blank"
                                className="group underline"
                                aria-label="隐私声明"
                            >
                                隐私政策
                            </Link>
                            。
                        </p>
                    </div>

                    <div className="flex flex-col w-full md:w-1/2 space-y-4 bg-gray-50 px-4 py-1">
                        <Auth
                            supabaseClient={supabase}
                            view="sign_up"
                            additionalData={{
                                referred_by: refererCode,
                                referer_code: randomNanoID(),
                            }}
                            redirectTo={redirectUrl}
                            localization={{
                                variables: {
                                    sign_up: {
                                        social_provider_text: "使用 {{provider}} 注册",
                                        link_text: "还没有账户？点击注册",
                                        button_label: "注册",
                                        email_label: "Email",
                                        password_label: "密码",
                                        email_input_placeholder: "输入邮箱",
                                        password_input_placeholder: "输入密码",
                                        confirmation_text: "请查收收件箱",
                                    },
                                    sign_in: {
                                        social_provider_text: "使用 {{provider}} 登录",
                                        link_text: "已有账户？点击登录",
                                        button_label: "登录",
                                        email_label: "Email",
                                        password_label: "密码",
                                        email_input_placeholder: "输入邮箱",
                                        password_input_placeholder: "输入密码",
                                    },
                                    magic_link: {
                                        link_text: "发送一次性登录链接",
                                    },
                                    forgotten_password: {
                                        link_text: "忘记密码？",
                                    },
                                },
                            }}
                            // onlyThirdPartyProviders
                            magicLink
                            socialLayout="horizontal"
                            providers={["google", "notion", "github"]}
                            appearance={{
                                theme: ThemeSupa,
                                variables: {
                                    default: {
                                        colors: {
                                            brand: "#1a83f8",
                                            brandAccent: "#1a83f8",
                                            brandButtonText: "white",
                                        },
                                    },
                                },
                            }}
                        />
                        {/*<Input placeholder="或输入邮件地址" />*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
