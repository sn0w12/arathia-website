import Link from "next/link";
import { playSound } from "@/lib/audio";
import { useNavigation } from "@/hooks/use-navigation";
import { ReactNode } from "react";

interface TransitionLinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: ReactNode;
    className?: string;
}

export function TransitionLink({
    href,
    children,
    className,
    ...props
}: TransitionLinkProps) {
    const { navigate } = useNavigation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        playSound("1.mp3");
        navigate(href);
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={className}
            {...props}
        >
            {children}
        </Link>
    );
}
