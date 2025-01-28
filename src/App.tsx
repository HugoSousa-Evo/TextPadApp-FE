import './App.css';
import { AuthProvider } from './auth/AuthProvider';
import { StartPage } from './startPage/StartPage';
import { Textpad } from './textpad/Textpad';
import { UserPage } from './userPage/UserPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        {
          <StartPage/>
        }
      </AuthProvider>
    </div>
  );
}

export default App;

/*

<StartPage />
<UserPage />
<Textpad />

*/