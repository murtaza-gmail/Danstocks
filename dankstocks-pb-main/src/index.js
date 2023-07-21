import React from 'react';
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Box from '@mui/material/Box';
import './index.css';
import {BaseComponent} from './misc/components'
import Home from './home';
import SingleEquity from './singleEquity';
import Portfolio from './portfolio';
import Earnings from './earnings';
import Account from './account';
import {pallete, style} from './misc/style'
import {ClerkProvider} from "@clerk/clerk-react";
import {AuthProvider} from './AuthContext';

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw new Error("missing publishable key")
// }
// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const clerkPubKey = "pk_test_aGFybWxlc3MtYnVsbGZyb2ctMjcuY2xlcmsuYWNjb3VudHMuZGV2JA"

function ErrorResponse (props) {
  return (
    <BaseComponent>
      <Box sx={{fontSize: '2vw', display: 'flex', justifyContent: 'center', height: 1, width: 1, color: '#ffffff', backgroundColor: pallete.dankstocksGreyDark}}>
        {'Looks like something went wrong!'}
      </Box>
    </BaseComponent>
    )
}

const router = createBrowserRouter([
  {
    path: "/", 
    element: (<Home/>),
    errorElement: (<ErrorResponse/>)
  },
  {
    path: "/stock/:ticker/:view", 
    loader: (r) => r.params,
    element: (<SingleEquity/>),
    errorElement: (<ErrorResponse/>)
  },
  {
    path: "/portfolio",
    element: (<Portfolio/>),
    errorElement: (<ErrorResponse/>)
  },
  {
    path: "/earnings", 
    element: (<Earnings/>),
    errorElement: (<ErrorResponse/>)
  },
  {
    path: "/account", 
    element: (<Account/>),
    errorElement: (<ErrorResponse/>)
  }
]);

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ClerkProvider>
  )
