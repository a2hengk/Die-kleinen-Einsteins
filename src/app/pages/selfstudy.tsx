import stylesContainer from '../styles/selfstudy-styles/container.module.css';
import stylesStatusbar from '../styles/selfstudy-styles/statusbar.module.css';
import stylesBody from '../styles/overview-styles/body.module.css';

export default function SelfStudy() {
  return (
    <div className={stylesContainer.container}>
      <h1>Self Study</h1>
      <main className={stylesBody.body}>
        <div className={stylesStatusbar.statusbar}>
          <span className={stylesStatusbar.correctCount}>Correct: 0</span>
        </div>
      </main>
    </div>
  );
}