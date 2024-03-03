import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";

const supabase = createClientComponentClient();

const fetchUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  console.log(data.user)
  return data.user;
};

export function useUser() {
  const { data: user, error, isValidating } = useSWR('user', fetchUser, {
    shouldRetryOnError: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    user,
    loading: !user && isValidating,
    error,
  };
}
