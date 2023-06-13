import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogContentText, DialogTitle, InputAdornment } from "@mui/material";
import { useState } from "react";

import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import TextField from '@mui/material/TextField';

const LoginModal = ({ open, handleSetPseudo}) => {
    
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;

    const [pseudoInput, setPseudoInput] = useState('');

    async function handleSetPseudoInComp() {
        if(pseudoInput.length > 1) {
            var cleanPseudo = pseudoInput.replace(regex, '');
            handleSetPseudo(cleanPseudo);
        }
    }
    return(
         <Dialog open={open}>
            <DialogTitle className='flexRowCenterH' sx={{ m: 0,p:1 }}>
                <Icon icon='carbon:user-avatar' style={{marginRight:'10px'}} /> Bienvenue !
            </DialogTitle>  
            <DialogContent dividers>
              <DialogContentText>
                <TextField
                    id="UserChoosePseudoInput"
                    type="text"
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter')  { handleSetPseudoInComp()}
                    }}
                    label="Entre un pseudo"
                    helperText="Ton pseudo est a titre indicatif et est affiché dans l'interface."
                    value={pseudoInput}
                    onChange={e => setPseudoInput(e.target.value)}
                    sx={{ width: '100%', MarginTop:1, paddingRight:'0', "& .MuiOutlinedInput-root": {
                        paddingRight: 0
                    } }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment  sx={{
                            padding: "27.5px 14px",
                            backgroundColor: "#23282d",
                            color:'var(--white)',
                            cursor:'pointer',
                            }} position="end" onClick={e=> handleSetPseudoInComp()}>
                            <DoubleArrowIcon  />
                            </InputAdornment>
                        ),
                    }}
                />
              </DialogContentText>
            </DialogContent>
        </Dialog>
    )
};

export default LoginModal;