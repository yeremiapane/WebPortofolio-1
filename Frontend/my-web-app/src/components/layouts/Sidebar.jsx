import React from "react";
import { Link, useLocation  } from "react-router-dom";
import { Sidebar, Menu, MenuItem, Submenu, Logo } from "react-mui-sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded';
import AssignmentIcon from "@mui/icons-material/Assignment";
import CommentIcon from "@mui/icons-material/Comment";
import MarkChatReadRoundedIcon from '@mui/icons-material/MarkChatReadRounded';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import AssistantRoundedIcon from '@mui/icons-material/AssistantRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';

const SideBar = () => {
    return (
        <Sidebar width={"270px"}>
            <Logo img="https://adminmart.com/wp-content/uploads/2024/03/logo-admin-mart-news.png">
                Admin
            </Logo>
            <Menu subHeading="Dashboard">
                <MenuItem link="/admin/dashboard" icon={<DashboardIcon />}>
                    Dashboard
                </MenuItem>
            </Menu>
            <Menu subHeading="Articles">
                <Submenu title="Articles" icon={<SummarizeRoundedIcon/>}>
                    <MenuItem link="/admin/articles" icon={<ArticleIcon/>}>Article List</MenuItem>
                    <MenuItem link="/admin/articles/create" icon={<EditNoteRoundedIcon/>}>Create Article</MenuItem>
                    <MenuItem link="/admin/articles/update" icon={<SyncAltRoundedIcon/>}>Update Article</MenuItem>
                </Submenu>
            </Menu>
            <Menu subHeading="Certificates">
                <Submenu title="Cretificates" icon={<StarsRoundedIcon/>}>
                    <MenuItem link="/admin/certificates" icon={<AssignmentIcon/>}>Certificate List</MenuItem>
                    <MenuItem link="/admin/certificates/create" icon={<EditNoteRoundedIcon/>}>Create Certificate</MenuItem>
                    <MenuItem link="/admin/certificates/update" icon={<SyncAltRoundedIcon/>}>Update Certificate</MenuItem>
                </Submenu>
            </Menu>
            <Menu subHeading="Comments">
                <Submenu title="Comments" icon={<CommentIcon/>}>
                    <MenuItem link="/admin/comments" icon={<MarkChatReadRoundedIcon/>}>Comment List</MenuItem>
                    <MenuItem link="/admin/comments/:id" icon={<AssistantRoundedIcon/>}>Comment Detail</MenuItem>
                </Submenu>
            </Menu>
        </Sidebar>
    );
};

export default SideBar;
