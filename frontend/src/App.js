import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="vs-app">
      <PipelineToolbar />
      <main className="vs-main">
        <PipelineUI />
        <SubmitButton />
      </main>
    </div>
  );
}

export default App;
