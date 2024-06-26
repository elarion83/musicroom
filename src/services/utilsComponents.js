import { ReactSVG } from "react-svg";

const UserAvatarComponent = ({user, cssClass}) => {
    return(
        <ReactSVG src={"./img/avatars/botts"+user.customDatas.avatarId+".svg"}  className={cssClass} style={{'outlineColor': 'rgba('+user.customDatas.colorRgb+',0.7)'}}/>
    )
};

export default UserAvatarComponent;