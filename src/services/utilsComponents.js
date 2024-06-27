import { ReactSVG } from "react-svg";

const UserAvatarComponent = ({user, cssClass}) => {
    return(
        <ReactSVG  src={"./img/avatars/botts"+user.customDatas.avatarId+".svg"}  className={cssClass} />
    )
};

export default UserAvatarComponent;