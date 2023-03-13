import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import Artplayer from '../../ArtPlayer';
import ButtomCustom from '../../ButtonRound';

const PracticalStep = ({ data }) => {

    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                
            </Grid>

            <Grid item xs={12} className='lessons-button-container-center'>
                <ButtomCustom variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    )
}

export default PracticalStep;