"use client";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Modal from "@/app/components/ui/modal";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const AuthModal = ({ showModal, setShowModal }: { showModal: boolean, setShowModal: ()=> void }) => {
  async function signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  }

  return (
    <>
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
            <h3 className="font-display text-2xl font-bold">登录 AInnotator</h3>
          </div>

          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 md:px-16">
            <Auth
              supabaseClient={supabase}
              redirectTo="/"
              localization={{
                variables: {
                  sign_up: {
                    social_provider_text: "使用 {{provider}} 注册",
                  },
                  sign_in: {
                    social_provider_text: "使用 {{provider}} 登录",
                  },
                },
              }}
              onlyThirdPartyProviders
              // magicLink
              providers={[
                  "google",
                  "notion",
                  "github",
              ]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#F17EB8",
                      brandAccent: "#f88dbf",
                      // brandButtonText: "white",
                    },
                  },
                },
              }}
            />
          </div>
          <p className="pb-6 text-center text-slate-400">
            点击登录或注册，即同意
            <a
              href="/terms-of-use"
              target="_blank"
              className="group underline"
              aria-label="服务条款"
            >
              服务条款
            </a>
            和
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
      </Modal>
    </>
  );
};
