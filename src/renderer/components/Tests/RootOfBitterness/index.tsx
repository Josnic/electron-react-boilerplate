import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import DOMPurify from 'dompurify';
import TextField from '@mui/material/TextField';
import ButtomCustom from '../../ButtonRound';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TestTitle from '../TestTitle';
import '../styles.scss';


const RootOfBitterness = ({ data }) => {
    
    const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };
    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <TestTitle title={"Autoevaluación"} />
            </Grid>
            <Grid item xs={12}>
               <div className='tests-container'>
                    <div className='question-container'>
                        <div className='question root-off-bitterness'>
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario?
                        </div>
                        <div className='select-container'>

                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                       
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={age}
                                label=""
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                
                                </MenuItem>
                                <MenuItem value={10}>Casi siempe</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>

                        </div>
                    </div>
               </div>
            </Grid>
            <Grid item xs={12} className='lessons-button-container-center'>
                <ButtomCustom variant="contained" rounded>
                    Continuar
                </ButtomCustom>
            </Grid>
        </Grid>
    )
}

export default RootOfBitterness;