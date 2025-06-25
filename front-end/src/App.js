



import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import TransactionsForm from './Application/components/TransactionsForm';

import Transaclist from './Application/components/Transclist';
import Summary from './Application/components/Summary';

import Toggle from './Application/components/Toggle';



const App = () => {




    return (
        <Router>
            <div style={{ display: 'flex' }}>
                <Toggle />
                {/* <div style={{ marginLeft: '250px', padding: '20px', width:'100%' }} id='main-container'> */}
                <div >
                    <Routes>

                            <Route path="/" element={<Summary />} />

                        
                        <Route path="/transaction" element={<TransactionsForm />} />
                        <Route path="/view-transaction" element={<Transaclist />} />
                    </Routes>

                </div>
            </div>
        </Router>
    );
};

export default App;
