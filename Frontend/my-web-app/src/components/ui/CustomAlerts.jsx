import React from "react";
import { Alert } from "@mui/material";

export default function CustomAlert({ severity, message, onClose }) {
    return (
        <div className="my-2">
            <Alert severity={severity} onClose={onClose}>
                {message}
            </Alert>
        </div>
    );
}
