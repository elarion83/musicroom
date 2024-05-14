import CelebrationIcon from '@mui/icons-material/Celebration';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, InstapaperIcon, InstapaperShareButton, RedditIcon, RedditShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton } from 'react-share';

export const notifsTextArray = {
    userArrived:'//AUTHOR// a rejoins la playlist !',
    userLeaved: '//AUTHOR// a quitté la playlist !',
    userSync:'//AUTHOR// s\'est synchronisé!',
    userUnSync: '//AUTHOR// s\'est désynchronisé!',
    AccNotPremium: "Le compte utilisé n'est pas premium."
};  

export const reactsArray = {
    laugh: {
        name:'laugh',
        color:'orange',
        animation:'animate__animated animate__fadeInUp animate__delay-1s animate__faster',
        icon:<EmojiEmotionsIcon fontSize="small" sx={{color:'var(--white)'}} />
    },
    heart: {
        name:'heart',
        color:'var(--red-2) !important',
        animation:'animate__animated animate__fadeInUp animate__delay-1s',
        icon:<FavoriteIcon fontSize="small" sx={{color:'var(--white)'}} />
    },
    party: {
        name:'party',
        color:'#ff9c22 !important',
        animation:'animate__animated animate__fadeInUp animate__delay-1s animate__fast',
        icon:<CelebrationIcon fontSize="small" sx={{color:'var(--white)'}} />
    }
}

export const shareArray = {
    email: {
        button:EmailShareButton,
        icon:EmailIcon
    },
    reddit: {
        button:RedditShareButton,
        icon:RedditIcon
    },
    whatsapp: {
        button:WhatsappShareButton,
        icon:WhatsappIcon
    },
    telegram: {
        button:TelegramShareButton,
        icon:TelegramIcon
    },
    twitter: {
        button:TwitterShareButton,
        icon:TwitterIcon
    },
    facebook: {
        button:FacebookShareButton,
        icon:FacebookIcon
    },
    instagram:{
        button:InstapaperShareButton,
        icon:InstapaperIcon
    }
}
