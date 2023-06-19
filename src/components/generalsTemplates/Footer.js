import Box from '@mui/material/Box';
import React, { useState } from "react";

import MentionsLegalesModal from './modals/MentionsLegalesModal';
import { Typography } from '@mui/material';

const Footer = () => {

    const [legalMentionsModal, setLegalMentionsModal] = useState(false);

    return(
            <Box sx={{ position:'absolute', bottom:0, display: 'flex', justifyContent: 'center', width:'100%' }}>
                
                <Typography onClick={(e) => setLegalMentionsModal(true)} href="" style={{cursor:'pointer',color:'var(--main-color)'}}> 
                    Mentions légales 
                </Typography>

                <MentionsLegalesModal open={legalMentionsModal} changeOpen={setLegalMentionsModal}/>
            </Box>
  
    )
};

export default Footer;