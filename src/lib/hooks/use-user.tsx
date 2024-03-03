'use client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {useEffect, useState} from "react";
import {User} from "@supabase/supabase-js";

const supabase = createClientComponentClient();

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          throw error;
        }
        setUser(data.user);
      } catch (error: any) {
        console.error('Error fetching user:', error.message);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []); // Empty dependency array ensures this effect only runs once after the initial render

  return { user, loading, error };
}
