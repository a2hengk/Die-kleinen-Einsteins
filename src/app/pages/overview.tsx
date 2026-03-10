import styleContainer from "../styles/overview-styles/container.module.css";
import styleButton from "../styles/overview-styles/button.module.css";
import styleBody from "../styles/overview-styles/body.module.css";

export default function Overview() {
    return (
        <div className={styleContainer.header}>
            <h1 className={styleContainer.title}>Karteikartenuebersicht</h1>
            <main className={styleBody.main}>
                <div className={styleContainer.cardContainer}>
                    <div className={styleContainer.card}>
                        <button className={styleButton.createButton}>+</button>
                        <button className={styleButton.deleteButton}>-</button>
                    </div>
                </div>
            </main>
        </div>
    );
}