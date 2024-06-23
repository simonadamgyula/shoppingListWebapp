export default function Members({ members }: { members?: User[] | null }) {
    return (
        <div className="householdMembers">
            {members && members.map((member, index) => {
                return (
                    <img key={index} style={{ left: `${index * 35}px` }} src={member.profile_picture} alt={member.username} className="memberPfp" />
                )
            })}
        </div>
    )
}