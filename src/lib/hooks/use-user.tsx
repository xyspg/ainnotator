import { createClient } from "@/lib/supabase/client";
import useSWR from "swr";

const supabase = createClient();

const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};

export function useUser() {
  const { data: user, error, isValidating } = useSWR('user', fetchUser, {
    shouldRetryOnError: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });

  return {
    user,
    loading: !user && isValidating,
    error,
  };
}
