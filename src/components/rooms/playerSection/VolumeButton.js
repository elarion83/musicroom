
import React, { useEffect } from "react";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

import { withTranslation } from 'react-i18next';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        marginTop:'1px',
        marginLeft:'2px',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="25" width="20" viewBox="0 0 400 400"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M276.914133,274.101547 L243.589973,247.442773 C283.38304,204.875093 283.38432,138.998827 243.588693,96.4311467 L276.912853,69.77216 C329.118507,127.992107 329.118507,215.880107 276.914133,274.101547 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  
  
    '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
        marginTop:'2px',
        marginLeft:'-3px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 80 180"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M143.221,141.225L97.919,89.519V7.501c0-2.931-1.707-5.593-4.37-6.815   c-2.665-1.225-5.796-0.784-8.018,1.127L48.76,33.411L21.728,2.559c-2.73-3.115-7.469-3.428-10.583-0.698   C8.029,4.59,7.716,9.328,10.446,12.443l26.568,30.323H16.087c-4.142,0-7.5,3.357-7.5,7.5V103.4c0,4.143,3.358,7.5,7.5,7.5h21.787   l47.658,40.954c1.388,1.192,3.129,1.812,4.89,1.812c1.06,0,2.127-0.225,3.128-0.685c2.663-1.223,4.37-3.885,4.37-6.815v-33.885   l34.02,38.828c1.483,1.692,3.558,2.558,5.644,2.558c1.754,0,3.517-0.612,4.939-1.859   C145.638,149.078,145.951,144.34,143.221,141.225z M82.919,23.835v48.564L58.645,44.694L82.919,23.835z M23.587,57.767h9.566V95.9   h-9.566V57.767z M82.919,129.832L48.153,99.956V55.481l34.766,39.68V129.832z"/></svg>')`,
      
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));


const VolumeButton = ({volume, setVolume}) => {

  async function setVolumeInComp() {
    if(volume === 0) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  }
  return (
     <FormGroup>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ ml:0.5, mt: 1 }}  className='volumeButton' onChange={(e) => setVolumeInComp()} defaultChecked={volume !== 0 ? true : false}/>}
      />
    </FormGroup>
  )
};

export default withTranslation()(VolumeButton);