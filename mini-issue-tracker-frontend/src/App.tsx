import './App.css';
import RouterList from './routes/routes';
import Toast from './components/Toast';

function App() {
  return (
    <>
      {/* ============== Routes ============= */}
      
      <RouterList />

      {/* ======= Notification Toast ===========  */}
      <Toast />
    </>
  );
}

export default App;

