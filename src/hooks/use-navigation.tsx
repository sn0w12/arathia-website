import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "@/contexts/transition-context";

export const useNavigation = () => {
    const router = useRouter();
    const { setIsOpen, duration } = useTransition();

    const navigate = useCallback(
        (href: string) => {
            setIsOpen(false);
            router.prefetch(href);
            setTimeout(() => {
                router.push(href);
            }, duration);
        },
        [router, setIsOpen, duration]
    );

    return { navigate };
};
