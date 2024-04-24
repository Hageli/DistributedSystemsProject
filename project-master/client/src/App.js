import Home from "./components/Home";
import Mainpage from "./components/Mainpage";
import DisplayImages from "./components/DisplayImages";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import "./App.css"
import { useCookies } from 'react-cookie'

function App() {
  const [ cookies, setCookie, removeCookie ] = useCookies(['user']);
  
  const authToken = cookies.AuthToken;

//        { authToken && <Route path="/mainpage" element={<Mainpage />}/>}
//         <Route path="/mainpage" element={<Mainpage />}/>

  return (
    // SOME ROUTES ONLY SHOW IF AUTHTOKEN EXISTS AKA USER IS LOGGED IN
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />}/>
        { authToken && <Route path="/mainpage" element={<Mainpage />}/>}
        <Route path="/images" element={<DisplayImages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
