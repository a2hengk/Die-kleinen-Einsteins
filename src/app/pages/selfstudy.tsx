import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import stylesStatusbar from '../styles/selfstudy-styles/statusbar.module.css';
import stylesBody from '../styles/overview-styles/body.module.css';

export default function SelfStudy() {
  return (
    <div className={stylesContainer.container}>
      <h1 className={stylesContainer.title}>Self Study</h1>
      <main className={stylesBody.body}>
        <div className={stylesStatusbar.statusbar}>
          <span>Correct: <span className={stylesStatusbar.correctCount}>0</span></span>
          <span>Wrong: <span className={stylesStatusbar.wrongCount}>0</span></span>
        </div>
        <div className={stylesContainer.card}></div>
        <div className={stylesContainer.buttons}>
          <button className={stylesContainer.right}>Correct</button>
          <button className={stylesContainer.wrong}>Wrong</button>
          <button className={stylesContainer.showAnswer}>Show Answer</button>
        </div>
      </main>
    </div>
  );
}