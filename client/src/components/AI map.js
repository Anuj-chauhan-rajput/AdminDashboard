import React from 'react';
import { Box, Grid, Paper } from '@mui/material';

const Node = ({ children }) => {
  return (
    <Paper sx={{ padding: 2, textAlign: 'center', position: 'relative' }}>
      {children}
    </Paper>
  );
};

const NetworkChart = () => {
  return (
    <Box sx={{ flexGrow: 1, height: '35vh', backgroundColor: '#f5f5f5', padding: 2 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Node>CEO</Node>
        </Grid>
        <Grid item xs={6}>
          <Node>M1</Node>
        </Grid>
        <Grid item xs={6}>
          <Node>M2</Node>
        </Grid>
        <Grid item xs={3}>
          <Node>Employee 1</Node>
        </Grid>
        <Grid item xs={3}>
          <Node>Employee 2</Node>
        </Grid>
        <Grid item xs={3}>
          <Node>Employee 3</Node>
        </Grid>
        <Grid item xs={3}>
          <Node>Employee 4</Node>
        </Grid>
      </Grid>
    
 
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          height: 2,
          width: '25%',
          top: '30%',
          left: '12.5%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          height: 2,
          width: '25%',
          top: '30%',
          left: '62.5%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: 2,
          height: '40%',
          top: '30%',
          left: '25%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'black',
          width: 2,
          height: '40%',
          top: '30%',
          left: '75%',
        }}
      />
    </Box>
  );
};

export default NetworkChart;
