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
import NumericInput from 'react-numeric-input';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import TestTitle from '../TestTitle';
import '../styles.scss';

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
  }

  const drawerWidth = 240;

  

const SituationalAnalysis = ({ data }) => {
    
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

   


  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
    return (
        <Grid container columns={{ xs: 4, md: 12 }} spacing={2}>
            <Grid item xs={12}>
                <TestTitle title={"Autoevaluación"} />
            </Grid>
            <Grid item xs={12}>
               <div className='tests-container'>

               <Box >
                <CssBaseline />
                <TestTitle title={"Autoevaluación"} component={"nav"} color={'secondary'}/>
              
                <Box component="main" sx={{ p: 3 }}>

                    <div className='question-container'>
                        <div className='question situacional-analysis'>
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario? 
                            Estás desarrollando tu potencial en lo que haces a diario?
                        </div>
                        <div className='input-number-container'>

                        <NumericInput
                            value={0}
                            min={0} 
                            max={10} 
                            step={1}
                            size={6}
                            style={{
                                wrap: {
                                    background: 'white',
                                    boxShadow: '0 0 1px 1px #fff inset, 1px 1px 5px -1px #000',
                                    padding: '2px 2.26ex 2px 2px',
                                    borderRadius: '6px 3px 3px 6px',
                                    fontSize: 18
                                },
                                input: {
                                    borderRadius: '4px 2px 2px 4px',
                                
                                    padding: '0.1ex 1ex',
                                    border: '1px solid #white',
                                    marginRight: 4,
                                    display: 'block',
                                    fontWeight: 100,
                                    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)'
                                },
                                'input:focus' : {
                                    border: '1px inset #white',
                                    outline: 'none'
                                },
                                
                            }}
                        />

                        </div>
                    </div>

                   
                 
                </Box>
                </Box>



                    




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

export default SituationalAnalysis;