import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import {createBrowserRouter, Outlet} from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AppRouter from "../../routes/AppRouter.jsx";

const NAVIGATION = [
    { kind: 'header', segment: 'header-main', title: 'Main items' },
    { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },

    { kind: 'header', segment: 'header-article', title: 'Article' },
    {
        title: 'Article',
        icon: <ArticleOutlinedIcon />,
        children: [
            { segment: '/articles', title: 'Articles List', icon: <SummarizeOutlinedIcon /> },
            { segment: '/articles/create', title: 'Create Articles', icon: <RateReviewOutlinedIcon /> },
        ],
    },

    { kind: 'header', segment: 'header-certificates', title: 'Certificates' },
    {
        title: 'Certificates',
        icon: <StarsOutlinedIcon />,
        children: [
            { segment: '/certificates', title: 'List Certificates', icon: <SummarizeOutlinedIcon /> },
            { segment: '/certificates/create', title: 'Create Certificate', icon: <RateReviewOutlinedIcon /> },
        ],
    },

    { kind: 'header', segment: 'header-comments', title: 'Comments' },
    {
        title: 'Comments',
        icon: <ForumOutlinedIcon />,
        children: [
            { segment: '/comments', title: 'List Comments', icon: <SummarizeOutlinedIcon /> },
        ],
    },
];

const router = createBrowserRouter('/dashboard');

const demoTheme = createTheme({
    cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
    colorSchemes: { light: true, dark: true },
    breakpoints: { values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 } },
});

function DashboardLayoutAccount(props) {
    const { window } = props;

    const [session, setSession] = React.useState({
        user: { name: 'Yeremia Yosefan Pane', email: 'yeremiayosefanpane@hotmail.com' },
    });

    const authentication = React.useMemo(() => ({
        signIn: () => {
            setSession({
                user: { name: 'Yeremia Yosefan Pane', email: 'yeremiayosefanpane@hotmail.com' },
            });
        },
        signOut: () => { setSession(null); },
    }), []);

    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutAccount.propTypes = { window: PropTypes.func };

export default DashboardLayoutAccount;
