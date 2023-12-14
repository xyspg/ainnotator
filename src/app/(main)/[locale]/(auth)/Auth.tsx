"use client";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Modal from "@/app/components/ui/modal";
import { SpeechBubble } from "react-kawaii";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import {useUserStore} from "@/app/store";


export const AuthModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: () => void;
}) => {
  const supabase = createClient()
  const router = useRouter();

  const updateUser = useUserStore((state) => state.updateUser)

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      setShowModal()
      // updateUser(session?.user)
      router.refresh();
    }
  })
  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="w-full overflow-hidden shadow-xl md:max-w-3xl md:rounded-2xl md:border md:border-gray-200">
          <div className="flex flex-row justify-between">
            <div className="w-1/2 bg-white p-4 flex flex-col justify-center items-center">
              <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 pb-6 text-center md:px-16">
                <SpeechBubble size={100} mood="excited" color="#83D1FB" />
                <h3 className="font-display text-2xl font-bold">
                  登录 AInnotator
                </h3>
                <p className="text-sm text-slate-400">
                  新用户登录即送 50 次 AI 批注
                </p>
              </div>
              <p className="py-6 text-center text-sm text-slate-400">
                点击登录或注册，即同意{" "}
                <Link
                  href="/terms-of-use"
                  target="_blank"
                  className="group underline"
                  aria-label="服务条款"
                >
                  服务条款
                </Link>{" "}
                和{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="group underline"
                  aria-label="隐私声明"
                >
                  隐私政策
                </Link>
                。
              </p>
            </div>

            <div className="flex flex-col w-1/2 space-y-4 bg-gray-50 px-4 py-1">
              <Auth
                supabaseClient={supabase}
                redirectTo="https://localhost:3000/"
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
      </Modal>
    </>
  );
};
