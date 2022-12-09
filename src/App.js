import Genres from './components/Genres/Genres'
import './components/App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Workers from './components/Workers/WorkersPage';
import Keywords from './components/Keywords/Keywords';
import Animes  from './components/Anime/Animes';
import Series from './components/Series/Series';
import { SignIn } from './components/Client/SignIn';
import { SignUp } from './components/Client/SignUp';
import { AuthProvider } from './components/Client/auth';
import { ChakraProvider } from '@chakra-ui/react';
import { Home } from './components/Client/Home';
import { Account } from './components/Client/Account';
import { ResetPassword } from './components/Client/ResetPassword';
import { AnimeCardOne } from './components/Client/AnimeCardOne';
import { AnimeWatch } from './components/Client/AnimeWatch';
import { FavoritePage } from './components/Client/FavoritePage';
import { EmailPage } from './components/Client/EmailPage';
import { SubscribePage } from './components/Client/SubscribePage';
import  Recomendation  from './components/Recomendation/Recomendation';
import { Checks } from './components/Checks/Checks';
function App() {
  return (
    <ChakraProvider>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/Genres" element={<Genres/>}/>
        <Route path="/Workers" element={<Workers/>}/>
        <Route path="/Keywords" element={<Keywords/>}/>
        <Route path="/Anime" element={<Animes/>}/>
        <Route path='/Series' element={<Series/>}/>
        <Route path='/SignIn' element={<SignIn/>}/>
        <Route path='/SignUp' element={<SignUp/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/account/:id' element={<Account/>}/>
        <Route exact path='/password' element={<ResetPassword/>}/>
        <Route path='/anime/:id' element={<AnimeCardOne/>}/>
        <Route path='/watch/:id' element={<AnimeWatch/>}/>
        <Route path='/favorite' element={<FavoritePage/>}/>
        <Route path='/reset_password' element={<EmailPage/>}/>
        <Route path='/subscribe' element={<SubscribePage/>}/>
        <Route path='/recomendation' element={<Recomendation/>}/>
        <Route path='/checks' element={<Checks/>}/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
