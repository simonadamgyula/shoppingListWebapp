import { Link } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

export default function UserDisplay({ user }: { user: User | null }) {
    const [open, setOpen] = useState(false);
    const optionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [optionsRef, setOpen]);

    return user ? (
        <div
            className="userDisplay"
            onClick={() => setOpen(!open)}
        >
            <span>
                {user.username}
            </span>
            <img src={user.profile_picture} alt={user.username} />

            {open && (
                <div ref={optionsRef} className="userOptions">
                    <Link to={"/account"}>Settings</Link>
                    <Link to={"/logout"}>Log out</Link>
                </div>
            )}
        </div>
    ) : (
        <div className="userDisplay noUser">
            <Link to={"/login"}>Log in</Link>
            /
            <Link to={"/register"}>Register</Link>
        </div>
    )
}