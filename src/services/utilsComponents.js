import { ReactSVG } from "react-svg";

const UserAvatarComponent = ({user, cssClass, needOutline = true}) => {
    return(
        <ReactSVG  src={"./img/avatars/botts"+user.customDatas.avatarId+".svg"} style={{'outlineColor': needOutline ? 'rgba('+user.customDatas.colorRgb+',0.7)' : ''}} className={cssClass} />
    )
};

export default UserAvatarComponent;