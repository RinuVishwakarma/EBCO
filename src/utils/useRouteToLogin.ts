"use client";
import { useAppDispatch } from "@/store/reduxHooks";
import { setUrl } from "@/store/routeUrl";
import { useRouter } from "next/navigation";

export const useRouteToLogin = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const currentUrl = window.location.pathname + window.location.search;
     
      dispatch(
        setUrl({
          url: currentUrl,
        })
      );
      router.push("/login");
}