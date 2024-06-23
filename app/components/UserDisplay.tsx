import { Link } from "@remix-run/react";

export default function UserDisplay({ user }: { user: User | null }) {
    return user ? (
        <div className="userDisplay">
            <span>
                {user.username}
            </span>
            <img src={user.profile_picture} alt={user.username} />
        </div>
    ) : (
        <div className="userDisplay noUser">
            <Link to={"/login"}>Log in</Link>
            /
            <Link to={"/register"}>Register</Link>
        </div>
    )
}