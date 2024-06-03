import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Box, Typography } from '@mui/material';
import { withTranslation } from "react-i18next";
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
const RoomTutorial = ({layout,slideOutProp}) => {
    const animatedElementsRef = [];
    return(
        <>
        <Box    
        sx={{bottom:slideOutProp}}
            className={"roomTutorialContainer "+layout+" phoneAndTablet animate__animated animate__fadeInUp animate__slow"}>
            <Typography className="fontFamilyNunito" 
            sx={{color:'white', 
            
            textShadow: '2px 2px 6px rgba(0,0,0,1), 0px -5px 35px rgba(0,0,0,1)'}}
            >Swipe pour rechercher ! </Typography>
            <SwipeUpIcon className="SlideUp"/>
        </Box>
        <Box 
        sx={{bottom:slideOutProp}}
            className="roomTutorialContainer desktop animate__animated animate__fadeInUp animate__slow">
            <Typography className="fontFamilyNunito" sx={{color:'white'}}>Clique pour rechercher ! </Typography>
            <KeyboardDoubleArrowDownIcon className="ClickUp"/>
        </Box>
        </>
    )
};

export default withTranslation()(RoomTutorial);