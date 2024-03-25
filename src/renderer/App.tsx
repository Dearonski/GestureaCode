import { MemoryRouter as Router, Routes, Route } from "react-router-dom";

import { Layout } from "./pages/Layout";
import { Main } from "./pages/Main";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";

export const App = () => {
    return (
        <I18nextProvider i18n={i18n} defaultNS={"main"}>
            <Layout>
                <Router>
                    <Routes>
                        <Route path="/" element={<Main />} />
                    </Routes>
                </Router>
            </Layout>
        </I18nextProvider>
    );
};
