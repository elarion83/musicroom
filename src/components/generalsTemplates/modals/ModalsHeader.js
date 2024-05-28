import { DialogTitle } from "@mui/material";
import { withTranslation } from "react-i18next";

const ModalsHeader = ({icon, title}) => {
    return(
        <DialogTitle className='flexRowCenterH' sx={{ m: 0, p: 1 }}>
            {icon()} {title}
        </DialogTitle>
    )
};

export default withTranslation()(ModalsHeader);