import { Route, Routes } from 'react-router-dom';
import React, { Suspense } from "react";
import {Box, CircularProgress} from "@mui/material";

const ProductsComponent = React.lazy(() => import('../pages/Products/Products'));
const CheckoutStepperComponent = React.lazy(() => import('../pages/Checkout/CheckoutStepper'));

export const AppRoutes = () => {
    return (
        <Suspense fallback={<Box sx={{display: 'flex', justifyContent: 'center', marginTop: '30px'}}>
            <CircularProgress size={75} /></Box>}>
            <Routes>
                <Route path="/" element={<ProductsComponent />} />
                <Route path="/checkout" element={<CheckoutStepperComponent />} />
                <Route path="*" element={<ProductsComponent />} />
            </Routes>
        </Suspense>
    );
};
