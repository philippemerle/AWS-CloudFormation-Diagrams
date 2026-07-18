import { useState, useMemo } from 'react';
import { Toaster } from 'sonner';
import Header from './components/common/Header.jsx';
import CfnTab from './components/tabs/CfnTab/index.jsx';
import HistoryPanel from './components/common/HistoryPanel.jsx';
import { useHistory } from './hooks/useHistory.js';

function App() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [restoredItem, setRestoredItem] = useState(null);
  const { history, addToHistory, removeFromHistory, clearHistory } = useHistory();

  const handleRestoreFromHistory = (item) => {
    setRestoredItem(item);
    setIsHistoryOpen(false);
  };

  // Memoize historyContext to avoid recreating it on every render
  const clearRestoredItem = () => {
    setRestoredItem(null);
  };

  const historyContext = useMemo(
    () => ({ addToHistory, restoredItem, clearRestoredItem }),
    [addToHistory, restoredItem]
  );

  return (
    <div className="min-h-screen bg-[#0a1128] text-white flex flex-col">
      <Toaster
        position="top-right"
        expand={true}
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Header />
      <main className="flex flex-1 p-6">
        <CfnTab historyContext={historyContext} />
      </main>
      <HistoryPanel
        history={history}
        onRestore={handleRestoreFromHistory}
        onRemove={removeFromHistory}
        onClear={clearHistory}
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      />
    </div>
  );
}

export default App;
