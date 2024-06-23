import { flushSync } from "react-dom";
import Members from "./Members";

export default function HouseholdCard({ household, setContext }: { household: Household, setContext: (context: ContextValue | null) => void }) {
    return (
        <div
            className="household-card"
            onClick={() => {
                window.location.href = `/household/${household.id}`;
            }}
            style={{ backgroundColor: `hsl(${household.color}, 83%, 62%)` }}
        >
            <h3>{household.name}</h3>
            <Members members={household.members} />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 128 512"
                className="householdContext"
                onClick={(e) => {
                    e.stopPropagation();
                    flushSync(() => {
                        setContext({ household, x: e.clientX, y: e.clientY });
                    });
                }}
            >
                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
            </svg>
        </div>
    );
}