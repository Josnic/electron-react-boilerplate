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
import TestTitle from '../TestTitle';
import '../styles.scss';


const SelfAppraisal = ({ data }) => {
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log((event.target as HTMLInputElement).value);
      };

    const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} arrow classes={{ popper: className }}  placement="top" />
        ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.common.white,
            color: 'rgba(0, 0, 0, 0.87)',
            boxShadow: theme.shadows[1],
            fontSize: 11,
        },
        [`& .${tooltipClasses.arrow}`]: {
            color: theme.palette.common.white,
            "&:before": {
                border: "1px solid #E6E8ED"
              },
        },
    }));
    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <TestTitle title={"Autoevaluación"} />
            </Grid>
            <Grid item xs={12}>
               <div className='tests-container'>
                    <div className='question-container'>

                        <div className='question self-appraisal'>
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario?
                            <LightTooltip title="Add">
                                <IconButton>
                                    <LiveHelpIcon />
                                </IconButton>
                            </LightTooltip>
                        </div>
                        <div className='radio-container'>
                            <FormControl>
                                <RadioGroup
                                    row
                                    name="row-radio-buttons-group"
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="1" />
                                    <FormControlLabel value="2" control={<Radio />} label="2" />
                                    <FormControlLabel value="3" control={<Radio />} label="3" />
                                    <FormControlLabel value="4" control={<Radio />} label="4" />
                                    <FormControlLabel value="5" control={<Radio />} label="5" />
                                </RadioGroup>
                            </FormControl>
                        </div>

                    </div>
                    <div className='question-container'>

                        <div className='question self-appraisal'>
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario?
                        </div>
                        <div className='radio-container'>
                            <FormControl>
                                <RadioGroup
                                    row
                                    name="row-radio-buttons-group"
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="1" control={<Radio />} label="1" />
                                    <FormControlLabel value="2" control={<Radio />} label="2" />
                                    <FormControlLabel value="3" control={<Radio />} label="3" />
                                    <FormControlLabel value="4" control={<Radio />} label="4" />
                                    <FormControlLabel value="5" control={<Radio />} label="5" />
                                </RadioGroup>
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

export default SelfAppraisal;