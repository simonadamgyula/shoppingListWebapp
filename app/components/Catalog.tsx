import SubList from "./SubList";

export default function Catalog({ catalog, setAddItem }: { catalog: Section[], setAddItem: (item: NotAddedItem) => void }) {

    return (
        <div id="itemList">
            {catalog.map((section, index) => {
                return <SubList key={index} name={section.name} items={section.items} setAddItem={setAddItem} />;
            })}
        </div>
    )
}