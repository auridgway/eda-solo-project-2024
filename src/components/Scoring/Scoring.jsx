import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

export default function Scoring() {  
    return (
        <Paper sx={{ p: 1, m: 1 }} >
            <Typography variant="h5" textAlign="center">Scoring Rules</Typography>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" fontWeight={700}>Combination</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" fontWeight={700}>Reward</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Single 5</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >50 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Single 1</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >100 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 1's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >300 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 2's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >200 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 3's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >300 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 4's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >400 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 5's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >500 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three 6's</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >600 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >4 of Any Number</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >1000 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >5 of Any Number</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >2000 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >6 of Any Number</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >3000 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >1-6 Straight</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >1500 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Three Pairs</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >1500 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Four of Any Number with a Pair</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >1500 Points</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="center" spacing={2} direction='row'>
                <Grid item xs={6}>
                    <Typography textAlign="center" >Two Triplets</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography textAlign="center" >2500 Points</Typography>
                </Grid>
            </Grid>
        </Paper>
    )
}