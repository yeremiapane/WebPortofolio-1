import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import BrowserUpdatedOutlinedIcon from '@mui/icons-material/BrowserUpdatedOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import StarsOutlinedIcon from '@mui/icons-material/StarsOutlined';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Dashboard from '../../pages/admin/Dashboard/Dashboard.jsx'; // Pastikan path ke komponen Dashboard benar

// Contoh struktur navigasi dengan beberapa menu dan children
const NAVIGATION = [
    {
        segment: 'dashboard',
        title: 'Dashboard',
        icon: <DashboardIcon />,
    },
    {
        segment: 'article',
        title: 'Article',
        icon: <ArticleOutlinedIcon />,
        children: [
            {
                segment: 'articlesList',
                title: 'Articles List',
                icon: <SummarizeOutlinedIcon />,
            },
            {
                segment: 'createArticles',
                title: 'Create Articles',
                icon: <RateReviewOutlinedIcon />,
            },
            {
                segment: 'updateArticles',
                title: 'Update Articles',
                icon: <BrowserUpdatedOutlinedIcon />,
            },
        ],
    },
    {
        segment: 'certificates',
        title: 'Certificates',
        icon: <StarsOutlinedIcon />,
        children: [
            {
                segment: 'certificatesList',
                title: 'List Certificates',
                icon: <SummarizeOutlinedIcon />,
            },
            {
                segment: 'createCertificate',
                title: 'Create Certificate',
                icon: <RateReviewOutlinedIcon />,
            },
            {
                segment: 'updateCertificate',
                title: 'Update Certificate',
                icon: <BrowserUpdatedOutlinedIcon />,
            },
        ],
    },
    {
        segment: 'comments',
        title: 'Comments',
        icon: <ForumOutlinedIcon />,
        children: [
            {
                segment: 'commentList',
                title: 'List Comments',
                icon: <SummarizeOutlinedIcon />,
            },
            {
                segment: 'commentDetails',
                title: 'Comment Details',
                icon: <CategoryOutlinedIcon />,
            },
        ],
    },
    // Tambahkan menu baru sesuai kebutuhan
];

const demoTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
        },
    },
});

function DashboardLayoutAccount(props) {
    const { window } = props;

    const [session, setSession] = React.useState({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(
        () => ({
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        }),
        []
    );

    const router = useDemoRouter('admin/dashboard');
    const demoWindow = window !== undefined ? window() : undefined;

    return (
        <AppProvider
            session={session}
            authentication={authentication}
            navigation={NAVIGATION}
            router={router}
            theme={demoTheme}
            window={demoWindow}
        >
            <DashboardLayout>
                {/* Render konten Dashboard melalui komponen Dashboard */}
                <Dashboard />
            </DashboardLayout>
        </AppProvider>
    );
}

DashboardLayoutAccount.propTypes = {
    window: PropTypes.func,
};

export default DashboardLayoutAccount;
