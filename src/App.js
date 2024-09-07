import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './assets/styles/global.scss';
import routes from './routes/routes';
//Thư viện tạo hiệu ứng
import AOS from 'aos';
import 'aos/dist/aos.css';
import PrivateRoute from './utils/PrivateRoute';

AOS.init();

function App() {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    if (route.private) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<PrivateRoute element={route.element}/>}
                            />
                        );
                    }

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.element}
                        />
                    );
                })}
            </Routes>
        </Router>

    );
}

export default App;
