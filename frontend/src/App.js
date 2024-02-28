import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import ProtectedRoute from './pages/ProtectedRoute';
import PageLoading from './pages/PageLoading';
import Feed from './pages/Feed/Feed';
import Explore from './pages/Explore/Explore';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';
import Bookmarks from './pages/Bookmarks/Bookmarks';
import Lists from './pages/Lists/Lists';
import Profile from './pages/Profile/Profile';
import More from './pages/More/More';
import Subscription from './pages/Subscription/Subscription';

function App() {
  return (
    <div className="App">
      {/* <h1>Here we go again</h1> */}
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}>
            <Route index element={<Feed/>} />
          </Route>
          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}>
            <Route path='feed' element={<Feed></Feed>}/>
            <Route path='explore' element={<Explore></Explore>}></Route>
            <Route path='notifications' element={<Notifications/>}  ></Route>
            <Route path='messages' element={<Messages/>} ></Route>
            <Route path='bookmarks' element={<Bookmarks/>}  ></Route>
            <Route path='lists' element={<Lists/>} ></Route>
            <Route path='profile' element={<Profile/>} ></Route>
            <Route path='more' element={<More/>} ></Route>
          </Route>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/page-loading' element={<PageLoading/>}></Route>
          <Route path='/subscribe' element={<Subscription/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
