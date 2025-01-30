import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { AuthProvider } from './auth/AuthProvider';
import { StartPage } from './startPage/StartPage';
import { Textpad, TextpadProps } from './textpad/Textpad';
import { UserPage } from './userPage/UserPage';
import PrivateRoute from './auth/PrivateRoute';
import React from 'react';
import { User } from './userPage/userView/User';

function App() {

  const [currentDocument, setCurrentDocument] = React.useState<TextpadProps>({
    filename: "",
    owner: {name: ""}
  })

  return (
    <div className="App">

      <BrowserRouter>
        <AuthProvider>
          <Routes>

            <Route path='' element={<StartPage />} />

            <Route element={<PrivateRoute />} >
              <Route path='userpage' element={ <UserPage setCurrentDocument={(filename:string, owner:User) => setCurrentDocument({
                filename: filename,
                owner: owner
              })} />} />
              <Route path='textpad' element={ <Textpad {...currentDocument} />} />
            </Route>

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
