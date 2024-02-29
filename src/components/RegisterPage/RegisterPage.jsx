import React from 'react';

import { useHistory } from 'react-router-dom';
import RegisterForm from '../RegisterForm/RegisterForm';
import { Container } from "@mui/material";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { motion, AnimatePresence } from "framer-motion";

function RegisterPage() {
  const history = useHistory();
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
      <AnimatePresence mode="wait">
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
          <RegisterForm />
        </AnimatedPaper>
      </AnimatePresence>
    </Grid>
  </Container>

    // <div>
    //   <RegisterForm />

    //   <center>
    //     <button
    //       type="button"
    //       className="btn btn_asLink"
    //       onClick={() => {
    //         history.push('/login');
    //       }}
    //     >
    //       Login
    //     </button>
    //   </center>
    // </div>
  );
}

export default RegisterPage;
