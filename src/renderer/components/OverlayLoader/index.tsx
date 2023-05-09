import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';

export default function OverlayLoader({open, ready, buttonClick}) {

  const buttonSx = {
    ...(ready && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };
  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={()=>{}}
      >
        {
          ready ? (
            <Fab
              aria-label="save"
              color="primary"
              sx={buttonSx}
              onClick={buttonClick}
            >
              {<CheckIcon />}
            </Fab>
          ):(
            <CircularProgress color="secondary" />
          )
        }
      </Backdrop>
    </div>
  );
}