import SubList from "./SubList";

export default function Catalog({ catalog }: { catalog: Section[] }) {

    return (
        <div id="itemList">
            {catalog.map((section, index) => {
                return <SubList key={index} name={section.name} items={section.items} />;
            })}
        </div>
    )
}