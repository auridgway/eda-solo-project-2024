import React from 'react';
import LoginForm from '../LoginForm/LoginForm';
import { Container } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { motion, AnimatePresence } from "framer-motion";

function LoginPage() {

  const AnimatedPaper = motion(Paper);


  return (
    <Container>
      <Grid container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <AnimatePresence>
          <AnimatedPaper sx={{ p: 5, m: 1 }}
            animate={{
              scale: [0, 1],
              rotate: [180, 0]
              
            }}
            transition={{
              duration: 1.5,
            }}
            exit={{ 
              x: 100,
              opacity: 0 
            }}
            key="login"
          >
            <LoginForm />
          </AnimatedPaper>
        </AnimatePresence>
      </Grid>
    </Container>
  );
}

export default LoginPage;
